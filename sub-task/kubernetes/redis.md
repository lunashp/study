# redis service 구성
## 1. 패스워드 / redis port 변경 가능하게 구성 
## 2. node port 또는 LB활용 : 클러스터 외부 ip에서 접근 : redis cli 를 통한 접속 체크 

### redis_nodeport.yaml
```
---
apiVersion: v1
kind: Pod
metadata:
  name: redis
  labels:
    app: redis
spec:
  containers:
  - name: redis
    image: redis
    command:
    - redis-server
    args:
    - --requirepass
    - "myPassword"
    ports:
    - containerPort: 6379

---
apiVersion: v1
kind: Service
metadata:
  name: redis
spec:
  selector:
    app: redis
  ports:
  - name: redis
    port: 6379
    targetPort: 6379
    nodePort: 32000
  type: NodePort

```

### reids_lb.yaml
```
---
apiVersion: v1
kind: Pod
metadata:
  name: redis
  labels:
    app: redis
spec:
  containers:
  - name: redis
    image: redis
    command:
    - redis-server
    args:
    - --requirepass
    - "1234"
    ports:
    - containerPort: 6379

---
apiVersion: v1
kind: Service
metadata:
  name: redis
spec:
  selector:
    app: redis
  ports:
  - name: redis-port
    port: 80
    targetPort: 6379
  type: LoadBalancer

```