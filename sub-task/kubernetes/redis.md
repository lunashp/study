# redis service 구성
## 1. 패스워드 / redis port 변경 가능하게 구성 
## 2. node port 또는 LB활용 : 클러스터 외부 ip에서 접근 : redis cli 를 통한 접속 체크 

### redis.yaml
```
---
apiVersion: v1
kind: Service
metadata:
  name: redis-service
spec:
  type: NodePort
  ports:
  - targetPort: 6379              # 애플리케이션(파드)을 노출하는 포트
    port: 6379                    # 서비스를 노출하는 포트
    nodePort: 30008             # 외부 사용자가 애플리케이션에 접근하기 위한 포트번호(선택)
  selector:                             # 이 서비스가 적용될 파드 정보를 지정
    app: redis
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  labels:
    app: redis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
        - name: redis
          image: redis
          ports:
            - containerPort: 6379
          env:
            # - name: ALLOW_EMPTY_PASSWORD
            #   value: "yes"
            - name: REDIS_PASSWORD
              value: PaaS-TA@2023

```