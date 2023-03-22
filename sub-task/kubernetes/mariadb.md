# mariadb 서비스 구성
## 1. init.sql 적용(ConfigMap) 및 store data pvc 연결 
## 2. mariadb backup script 생성 (CronJob)
## 3. Remote Client Access : mariadb.((system_domain)) -> nodePort

### mariadb-pv.yaml
```
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mariadb-pv-volume # pv 이름
  labels:
    type: local
spec:
  storageClassName: mariadb-storage-class
  capacity:
    storage: 50Gi # 스토리지 용량 크기
  accessModes:
    - ReadWriteOnce # 하나의 Pod에서만 access가 가능하도록 설정, ReadWriteMany는 여러 개 노드에서 접근 가능
  hostPath:
    path: "/data/k8s/db/" # node에 저장될 스토리지 공간
```

### mariadb-pvc.yaml
```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mariadb-pv-claim # pvc 이름
spec:
  storageClassName: mariadb-storage-class
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 50Gi
```
- nfs가 아닌 node로 mount

### mariadb-configmap.yaml
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: mariadb-initdb-config
data:
  init.sql: |
    CREATE DATABASE IF NOT EXISTS mydata;
    USE mydata;
    CREATE TABLE friends (id INT, name VARCHAR(256), age INT, gender VARCHAR(3));
    INSERT INTO friends VALUES (1, 'Eric', 30, 'm');
    INSERT INTO friends VALUES (2, 'Luna', 26, 'f');
    INSERT INTO friends VALUES (3, 'Ash', 22, 'm');
```
- configmap 형식의 init sql 생성

### mariadb-secret.yaml
```
apiVersion: v1
kind: Secret
metadata:
  name: mariadb-secret
data:
  password: UGFhUy1UQUBsdW5h # PaaS-TA@luna
```
- password 해쉬값 생성 후 작성
  + echo -n PaaS-TA@luna | base64

### mariadb-svc.yaml
```
apiVersion: v1
kind: Service
metadata:
  name: mariadb
spec:
  selector:
    app: mariadb
  ports:
  - name: mariadb
    port: 3306
    targetPort: 3306
    nodePort: 30000
  type: NodePort
```
- NodePort로 연결 가능하게끔 구성

### mariadb-deployment.yaml
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mariadb
spec:
  selector:
    matchLabels:
      app: mariadb
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: mariadb
    spec:
      containers:
      - image: mariadb:10.7 # MariaDB 이미지 
        name: mariadb
        ports:
        - containerPort: 3306 # Container 포트
          name: mariadb
        volumeMounts:
        - name: mariadb-persistent-storage
          mountPath: /docker-entrypoint-initdb.d # 해당 폴더에 .sql 파일 존재 시 Container 생성 시 실행
        - mountPath: /var/lib/mysql # MariaDB 이미지 공식 데이터 저장소 경로
          subPath: "mysql"
          name: mairadb-data
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
           secretKeyRef:
             name: mariadb-secret # Secret의 이름
             key: password # Secret의 data에 들어간 key:value
      volumes:
      - name: mariadb-persistent-storage
        configMap:
          name: mariadb-initdb-config # configMap 설정
      - name: mairadb-data
        persistentVolumeClaim:
          claimName: mariadb-pv-claim # pv 볼륨 설정
```

### 정상 배포 확인
```
root@master:/home/ubuntu/workspace/mariadb# kubectl get pods -l app=mariadb
NAME                       READY   STATUS    RESTARTS   AGE
mariadb-6cbdcbd779-tbnpb   1/1     Running   0          3h27m
```

### mariaDB 접속
```
root@master:/home/ubuntu/workspace/mariadb# kubectl exec -it mariadb-6cbdcbd779-tbnpb -- bash
root@mariadb-6cbdcbd779-tbnpb:/# mysql -u root -p 
Enter password: 
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 10
Server version: 10.7.8-MariaDB-1:10.7.8+maria~ubu2004 mariadb.org binary distribution

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mydata             |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.000 sec)

MariaDB [(none)]> use mydata;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
MariaDB [mydata]> select * from friends;
+------+------+------+--------+
| id   | name | age  | gender |
+------+------+------+--------+
|    1 | Eric |   30 | m      |
|    2 | Luna |   26 | f      |
|    3 | Ash  |   22 | m      |
+------+------+------+--------+
3 rows in set (0.000 sec)
```
