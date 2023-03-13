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
