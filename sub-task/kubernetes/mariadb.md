# mariadb 서비스 구성
## 1. init.sql 적용(ConfigMap) 및 store data pvc 연결 
## 2. mariadb backup script 생성 (CronJob)
## 3. Remote Client Access : mariadb.((system_domain)) -> nodePort

### mariadb-pv.yaml
```
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mariadb-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
  - ReadWriteMany
  nfs:
    server: 10.0.20.19
    path: /home/share/nfs

```

### mariadb-pvc.yaml
```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mariadb-pvc
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 1Gi
```
- storage 용량을 50 으로 설정 시 bound 에러

#### ex
```
양희진
mariadb pvc 연결
MariaDB는 Kubernetes 클러스터 내에서 PersistentVolumeClaim (PVC)을 사용하여 데이터를 저장합니다. 이를 위해서는 다음과 같은 단계를 수행해야 합니다.

먼저 MariaDB를 실행할 Kubernetes 클러스터를 설정합니다.

데이터를 저장할 PVC를 생성합니다. 이를 위해서는 kubectl apply 명령어를 사용합니다. 예를 들어 다음과 같이 PVC를 생성할 수 있습니다.

yaml
Copy code
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mariadb-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
위 예시에서 metadata.name 필드에는 PVC의 이름을 지정하며, spec.accessModes 필드에서는 해당 PVC에 대한 액세스 모드를 정의합니다. 위 예시에서는 ReadWriteOnce 액세스 모드를 사용하므로 PVC를 한 번에 한 노드에서만 마운트할 수 있습니다. spec.resources.requests.storage 필드에서는 PVC에 요청되는 스토리지의 크기를 정의합니다.

MariaDB를 실행하는 Pod를 생성합니다. 이를 위해서는 kubectl apply 명령어를 사용합니다. 예를 들어 다음과 같이 Pod를 생성할 수 있습니다.
yaml
Copy code
apiVersion: v1
kind: Pod
metadata:
  name: mariadb
spec:
  containers:
  - name: mariadb
    image: mariadb:latest
    env:
      - name: MYSQL_ROOT_PASSWORD
        value: password
    volumeMounts:
      - name: mariadb-data
        mountPath: /var/lib/mysql
  volumes:
    - name: mariadb-data
      persistentVolumeClaim:
        claimName: mariadb-pvc
위 예시에서 metadata.name 필드에는 Pod의 이름을 지정하며, spec.containers 필드에서는 Pod 내에서 실행되는 컨테이너를 정의합니다. 위 예시에서는 MariaDB 이미지를 사용하여 컨테이너를 생성하며, env 필드에서는 root 사용자의 비밀번호를 정의합니다. volumeMounts 필드에서는 컨테이너 내의 마운트 지점을 정의합니다. 위 예시에서는 /var/lib/mysql 디렉터리에 PVC를 마운트합니다. volumes 필드에서는 Pod에 사용되는 볼륨을 정의합니다. 위 예시에서는 PVC를 참조하는 persistentVolumeClaim 유형의 볼륨을 사용합니다.

생성한 Pod가 정상적으로 실행되었는지 확인합니다.
csharp
Copy code
kubectl get pods
위 명령어를 사용하여 Pod의 상태를 확인합니다. 만약 Pod가 생성되고 실행 중이면, 해당 Pod의 이름과 상태가 출력됩니다.

이제 MariaDB PVC를 Kubernetes 클러스터 내에서 성공적으로 연결했습니다.




양희진
mariadb pvc와 init sql 연결
MariaDB에서 init SQL 파일을 사용하여 데이터베이스 스키마 및 데이터를 초기화할 수 있습니다. init SQL 파일은 일반적으로 Docker 컨테이너 실행 시 자동으로 실행됩니다. 그러나 Kubernetes 환경에서는 이를 구성해주어야 합니다.

init SQL 파일을 MariaDB PVC와 연결하는 방법은 다음과 같습니다.

MariaDB를 실행하는 Pod의 YAML 파일을 엽니다.
php
Copy code
kubectl edit pod <pod-name>
위 명령어를 사용하여 Pod의 YAML 파일을 엽니다. <pod-name>은 MariaDB를 실행하는 Pod의 이름입니다.

spec.containers 필드에서 MariaDB 컨테이너를 찾습니다.

spec.containers.command 필드에 다음과 같은 명령어를 추가합니다.

bash
Copy code
command:
  - /bin/sh
  - -c
  - >
    if [ ! -f /var/lib/mysql/initialized ]; then
      mysql -uroot -p$MYSQL_ROOT_PASSWORD < /var/lib/mysql/init.sql && touch /var/lib/mysql/initialized;
    fi;
    /docker-entrypoint.sh mysqld
위 예시에서 command 필드에서는 컨테이너가 실행되는 명령어를 정의합니다. 위 예시에서는 if 문을 사용하여 /var/lib/mysql/initialized 파일이 존재하지 않을 경우 mysql 명령어를 사용하여 /var/lib/mysql/init.sql 파일을 실행하고, 이 파일이 실행된 후 /var/lib/mysql/initialized 파일을 생성합니다. 이를 통해 init SQL 파일이 한 번만 실행되도록 합니다. 그리고 마지막으로 /docker-entrypoint.sh mysqld 명령어를 사용하여 MariaDB를 실행합니다.

spec.volumes 필드에서 init SQL 파일을 포함하는 볼륨을 정의합니다.
yaml
Copy code
volumes:
  - name: init-sql
    configMap:
      name: init-sql-configmap
위 예시에서 volumes 필드에서는 init SQL 파일을 포함하는 볼륨을 정의합니다. 이를 위해 configMap 유형의 볼륨을 사용합니다. configMap.name 필드에서는 init SQL 파일을 포함하는 ConfigMap의 이름을 지정합니다.

spec.containers.volumeMounts 필드에서 init SQL 파일을 마운트합니다.
yaml
Copy code
volumeMounts:
  - name: init-sql
    mountPath: /var/lib/mysql
    readOnly: true
위 예시에서 volumeMounts 필드에서는 init SQL 파일을 마운트합니다. mountPath 필드에서는 init SQL 파일을 포함하는 ConfigMap의 경로를 지정합니다. readOnly 필드에서는 이 볼륨이 읽기 전용으로 마운트되어야 함을 지정합니다.

Pod의 YAML 파일을 저장하고 종료합니다.
ruby
Copy code
:wq
이제 MariaDB PVC와 init SQL 파일을 연결하여 Kubernetes 클러스터에서 실행할 수 있습니다.




양희진
mariadb init sql pod 생성 
MariaDB init SQL 파일을 사용하여 Pod를 생성하는 방법은 다음과 같습니다.

init SQL 파일을 포함하는 ConfigMap을 생성합니다.
csharp
Copy code
kubectl create configmap init-sql-configmap --from-file=init.sql=<path-to-init-sql-file>
위 예시에서 <path-to-init-sql-file>은 init SQL 파일의 경로를 지정합니다.

MariaDB Pod의 YAML 파일을 생성합니다.
yaml
Copy code
apiVersion: v1
kind: Pod
metadata:
  name: mariadb-init-pod
spec:
  containers:
  - name: mariadb
    image: mariadb
    env:
    - name: MYSQL_ROOT_PASSWORD
      value: password
    volumeMounts:
    - name: init-sql
      mountPath: /var/lib/mysql
      readOnly: true
    ports:
    - containerPort: 3306
  volumes:
  - name: init-sql
    configMap:
      name: init-sql-configmap
위 예시에서 spec.containers 필드에서는 MariaDB 컨테이너를 정의합니다. spec.containers.image 필드에서는 MariaDB 이미지를 지정합니다. spec.containers.env 필드에서는 MYSQL_ROOT_PASSWORD 환경 변수를 설정합니다. spec.containers.volumeMounts 필드에서는 init SQL 파일을 마운트합니다.

spec.volumes 필드에서는 init SQL 파일을 포함하는 ConfigMap을 정의합니다.

Pod을 생성합니다.
lua
Copy code
kubectl create -f <pod-yaml-file>
위 예시에서 <pod-yaml-file>은 생성한 MariaDB Pod의 YAML 파일의 경로를 지정합니다.

이제 MariaDB init SQL 파일을 실행하는 Pod이 생성되었습니다. 이 Pod은 init SQL 파일을 실행하고 MariaDB를 시작합니다. 이 Pod을 사용하여 데이터베이스 스키마 및 데이터를 초기화할 수 있습니다.




양희진
쿠버네티스 init sql 생성
쿠버네티스에서 Init SQL을 사용하여 데이터베이스 스키마 및 데이터를 초기화하는 방법은 다음과 같습니다.

Init SQL 파일을 작성합니다.
Init SQL 파일은 일련의 SQL 쿼리를 포함하는 일반 텍스트 파일입니다. 이 파일에는 데이터베이스를 초기화하는 데 필요한 모든 쿼리가 포함되어 있습니다. 이 파일은 쿠버네티스 ConfigMap에 저장됩니다.

예를 들어, 다음은 데이터베이스 생성 및 사용자 생성을 수행하는 간단한 Init SQL 파일의 예입니다.

sql
Copy code
CREATE DATABASE mydb;
GRANT ALL ON mydb.* TO 'myuser'@'%' IDENTIFIED BY 'mypassword';
FLUSH PRIVILEGES;
Init SQL 파일을 포함하는 ConfigMap을 생성합니다.
csharp
Copy code
kubectl create configmap init-sql-configmap --from-file=init.sql=<path-to-init-sql-file>
위 예시에서 <path-to-init-sql-file>은 Init SQL 파일의 경로를 지정합니다.

Pod의 YAML 파일을 생성합니다.
yaml
Copy code
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mycontainer
    image: myimage
    volumeMounts:
    - name: init-sql
      mountPath: /init
  initContainers:
  - name: init-mysql
    image: mariadb
    env:
    - name: MYSQL_ROOT_PASSWORD
      value: mypassword
    volumeMounts:
    - name: init-sql
      mountPath: /init
    command: ["/bin/bash", "-c", "mysql -h localhost -u root -p${MYSQL_ROOT_PASSWORD} < /init/init.sql"]
  volumes:
  - name: init-sql
    configMap:
      name: init-sql-configmap
위 예시에서 spec.containers 필드에서는 작업을 수행하는 본문 컨테이너를 정의합니다. spec.initContainers 필드에서는 Init SQL을 실행하는 Init 컨테이너를 정의합니다.

spec.initContainers.image 필드에서는 Init 컨테이너에 사용할 이미지를 지정합니다. spec.initContainers.env 필드에서는 데이터베이스의 root 패스워드를 지정합니다. spec.initContainers.volumeMounts 필드에서는 Init SQL 파일을 마운트합니다.

spec.initContainers.command 필드에서는 Init SQL 파일을 실행하는 명령을 정의합니다.

spec.volumes 필드에서는 Init SQL 파일을 포함하는 ConfigMap을 정의합니다.

Pod을 생성합니다.
lua
Copy code
kubectl create -f <pod-yaml-file>
위 예시에서 <pod-yaml-file>은 생성한 Pod의 YAML 파일의 경로를 지정합니다.

이제 쿠버네티스 Init SQL을 사용하여 데이터베이스를 초기화하는 Pod이 생성되었습니다. 이 Pod은 Init SQL 파일을 실행하여 데이터베이스를 초기화합니다. 이 Pod을 사용하여 데이터베이스 스키마 및 데이터를 초기화할 수 있습니다.
```

#### configmap ex
```
apiVersion: v1
kind: ConfigMap
metadata: 
  name: config-dev
  namespace: default
data:
  DB_URL: localhost
  DB_USER: myuser
  DB_PASS: mypass
  DEBUG_INFO: debug
```

#### pod에서 pvc 볼륨 사용 예제
```
apiVersion: apps/v1
kind: Deployment
metadata: 
  name: kubernetes-simple-app
  labels:
    app: kubernetes-simple-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kubernetes-simple-app
template:
  metadata:
    labels:
      app: kubernetes-simple-app
spce:
  containers:
  - name: kubernetes-simple-app
    image: arisu1000/simple-container-app:latest
    ports:
    - containerPort: 8080
    imagePullPolicy: Always
    volumeMounts:
    - mountPath: "/tmp"
      name: myvolume
  volumes:
  - name: myvolume
    persistentVolumeClaim:
      claimName: pvc-hostpath
```

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
             key: password   # Secret의 data에 들어간 key:value
      volumes:
      - name: mariadb-persistent-storage
        configMap:
          name: mariadb-initdb-config # configMap 설정
      - name: mairadb-data
        persistentVolumeClaim:
          claimName: mariadb-pv-claim # pv 볼륨 설정
```