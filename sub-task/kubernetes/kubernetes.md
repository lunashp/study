# kubernetes
- 참고 문서
   + https://subicura.com/k8s/guide/kubectl.html
   + https://kubernetes.io/ko/

- 쿠버네티스는 컨테이너화된 워크로드와 서비스를 관리하기 위한 이식성이 있고. 확장가능한 오픈소스 플랫폼
- 쿠버네티스는 선언적 구성과 자동화를 모두 용이하게 해줌
- K8s라는 표기는 "K"와 "s"와 그 사이에 있는 8글자를 나타내는 약식 표기임
- 구글이 2014년에 쿠버네티스 프로젝트를 오픈소스화 함

<br/>

- 쿠버네티스는 PaaS가 아님
- 하드웨어 수준보다는 컨테이너 수준에서 운영되기 때문에, PaaS가 일반적으로 제공하는 배포, 스케일링, 로드 밸런싱과 같은 기능을 제공하며, 사용자가 로깅, 모니터링 및 알람 솔루션을 통합할 수 수 있음
- 쿠버네티스는 모놀리식이 아니어서 이런 기본 솔루션이 선택적이며 추가나 제거가 용이함
- 쿠버네티스는 개발자 플랫폼을 만드는 구성 요소를 제공하지만, 필요한 경우 사용자의 선택권과 유연성을 지켜줌

---

## 쿠버네티스 컴포넌트
<img src="https://d33wubrfki0l68.cloudfront.net/2475489eaf20163ec0f54ddc1d92aa8d4c87c96b/e7c81/images/docs/components-of-kubernetes.svg">

- 쿠버네티스를 배포하면 클러스터를 얻음
- 쿠버네티스 클러스터는 컨테이너화된 애플리케이션을 실행하는 노드라고 하는 워커 머신의 집합
   + `노드는 쿠버네티스의 작업 장비(worker machine)`
- 모든 클러스터는 최소 한 개의 워커 노드를 가짐
- 워커 노드는 애플리케이션의 구성요소인 파드를 호스트함
   + `파드는 클러스터에서 실행 중인 컨테이너의 집합`
- 컨트롤 플레인은 워커 노드와 클러스터 내 파드를 관리함
   + `컨트롤 플레인은 컨테이너의 라이프사이클의 정의, 배포, 관리하기 위한 API와 인터페이스들을 노출하는 컨테이너 오케스트레이션 레이어`
- 프로덕션 환경에서는 일반적으로 컨트롤 플레인이 여러 컴퓨터에 걸쳐 실행되고, 클러스터는 일반적으로 여러 노드를 실행하므로 내결함성과 고가용성이 제공됨

## 컨트롤 플레인 컴포넌트
- 컨트롤 플레인 컴포넌트는 클러스터에 관한 전반적인 결정(스케줄링 등)을 수행하고 클러스터 이벤트(디플로이먼트의 replicas 필드에 대한 요구 조건이 충족되지 않을 경우 새로운 파드를 구동시키는 것 등)를 감지하고 반응함

### kube-apiserver
- API server는 쿠버네티스 API를 노출하는 쿠버네티스 컨트롤 플레인 컴포넌트
- API server는 쿠버네티스 컨트롤 플레인의 프론트 엔드
- kube-apiserver는 수평으로 확장되도록 디자인되었음 즉, 더 많은 인스턴스를 배포해서 확장할 수 있음
- 여러 kube-apiserver 인스턴스를 실행하고, 인스턴스 간의 트래픽을 균형있게 조절할 수 있음

### etcd
- 모든 클러스터 데이터를 담는 쿠버네티스의 뒷단의 저장소로 사용되는 일관성/고가용성 키-값 저장소
- 쿠버네티스 클러스터에서 etcd를 뒷단의 저장소로 사용한다면, 이 데이털르 백업하는 계획은 필수

### kube-scheduler
- 노드가 배정되지 않은 새로 생성된 파드를 감지하고, 실행할 노드를 선택하는 컨트롤 플레인 컴포넌트
- 스케줄링 결정을 위해서 고려되는 요소는 리소스에 대한 개별 및 총체적 요구 사항, 하드웨어/소프트웨어/정책적 제약, 어피니티(affinity) 및 안티-어피니티(anti-affinity) 명세, 데이터 지역성, 워크로드-간 간섭, 데드라인을 포함

### kube-controller-manager
- 컨트롤러 프로세스를 실행하는 컨트롤 플레인 컴포넌트
- 논리적으로, 각 컨트롤러는 분리된 프로세스이지만, 복잡성을 낮추기 위해 모두 단일 바이너리로 컴파일되고 단일 프로세스 내에서 실행됨

   + 노드 컨트롤러: 노드가 다운되었을 때 통지와 대응에 관한 책임을 가짐
   + 잡 컨트롤러: 일회성 작업을 나타내는 잡 오브젝트를 감시한 다음, 해당 작업을 완료할 때까지 동작하는 파드를 생성
   + 엔드포인트 컨트롤러: 엔드포인트 오브젝트를 채움
      - 즉, 서비스와 파드를 연결시킴
   + 서비스 어카운트 & 토큰 컨트롤러: 새로운 네임스페이스에 대한 기본 계정과 API 접근 토큰을 생성

### cloud-controller-manager
- 클라우드별 컨트롤 로직을 포함하는 쿠버네티스 컨트롤 플레인 컴포넌트
- 클라우드 컨트롤러 매니저를 통해 클러스터를 클라우드 공급자의 API에 연결하고, 해당 클라우드 플랫폼과 상호 작용하는 컴포넌트와 클러스터와만 상호 작용하는 컴포넌트를 구분할 수 있게 해줌
- cloud-controller-manager는 클라우드 제공자 전용 컨트롤러만 실행함 
   + 자신의 사내 또는 PC 내부의 학습 환경에서 쿠버네티스를 실행 중인 경우 클러스터에는 클라우드 컨트롤러 매니저가 없음
- kube-controller-manager와 마찬가지로 cloud-controller-manager는 논리적으로 독립적인 여러 컨트롤 루프를 단일 프로세스로 실행하는 단일 바이너리로 결합함 
- 수평으로 확장(두 개 이상의 복제 실행)해서 성능을 향상시키거나 장애를 견딜 수 있음

## 노드 컴포넌트
- 노드 컴포넌트는 동작중인 파드를 유지시키고 쿠버네티스 런타임 환경을 제공하며, 모든 노드 상에서 동작함

### kubelet
- 클러스터의 각 노드에서 실행되는 에이전트
- 파드에서 컨테이너가 확실하게 동작하도록 관리함
- Kubelet은 다양한 메커니즘을 통해 제공된 파드 스펙(PodSpec)의 집합을 받아서 컨테이너가 해당 파드 스펙에 따라 건강하게 동작하는 것을 확실히 함
- Kubelet은 쿠버네티스를 통해 생성되지 않는 컨테이너는 관리하지 않음

### kube-proxy
- kube-proxy는 클러스터의 각 노드에서 실행되는 네트워크 프록시로, 쿠버네티스의 서비스 개념의 구현부
   + `서비스는 네트워크 서비스로 파드 집합에서 실행중인 애플리케이션을 노출하는 방법`
- kube-proxy는 노드의 네트워크 규칙을 유지 관리함
- 이 네트워크 규칙이 내부 네트워크 세션이나 클러스터 바깥에서 파드로 네트워크 통신을 할 수 있도록 해줌
- kube-proxy는 운영 체제에 가용한 패킷 필터링 계층이 있는 경우, 이를 사용함 
   + 그렇지 않으면, kube-proxy는 트래픽 자체를 포워드(forward) 함

### 컨테이너 런타임
- 컨테이너 런타임은 컨테이너 실행을 담당하는 소프트웨어

## 애드온
- 애드온은 쿠버네티스 리소스(데몬셋, 디플로이먼트 등)를 이용하여 클러스터 기능을 구현함
   + `데몬셋: 파드의 복제본을 틀러스터 노드 집합에서 동작하게 함`
   + `디플로이먼트: 복제된 애플리케이션을 관리`
- 이들을 클러스터 단위의 기능을 제공하기 때문에 애드온에 대한 네임스페이스 리소스는 kube-system 네임스페이스에 속함

### DNS
- 모든 쿠버네티스 클러스터는 클러스터 DNS를 갖추어야만 함
- 클러스터 DNS는 구성환경 내 다른 DNS 서버와 더불어, 쿠버네티스 서비스를 위해 DNS 레코드를 제공해주는 DNS 서버
- 쿠버네티스에 의해 구동되는 컨테이너는 DNS 검색에서 이 DNS 서버를 자동으로 포함

### 웹 UI (대시보드)
- 대시보드는 쿠버네티스 클러스터를 위한 범용 웹 기반 UI
- 사용자가 클러스터 자체뿐만 아니라, 클러스터에서 동작하는 애플리케이션에 대한 관리와 문제 해결을 할 수 있도록 해줌

### 컨테이너 리소스 모니터링
- 컨테이너 리소스 모니터링은 중앙 데이터베이스 내의 컨테이너들에 대한 포괄적인 시계열 매트릭스를 기록하고 그 데이터를 열람하기 위한 UI를 제공해 줌

### 클러스터-레벨 로깅
- 클러스터-레벨 로깅 메커니즘은 검색/열람 인터페이스와 함께 중앙 로그 저장소에 컨테이너 로그를 저장하는 책임을 짐

--- 

## kubectl 명령어 기본 구조
```
kubectl [command] [TYPE] [NAME] [flags]
```
- command: 자원(object)에 실행할 명령
   + create, delete, edit ...
- TYPE: 자원의 타입
   + node, pod, service
- NAME: 자원의 이름
- flags: 부가적으로 설정할 옵션
   + --help, -o options

---

## static container
- API 서버 없이 특정 노드에 있는 kubelet 데몬에 의해 직접 관리
- etc/kubernetes/manifests/ 디렉토리에 k8s yaml 파일을 저장 시 적용됨
- static pod 디렉토리 구성
   + #vi /var/lib/kubelet/config.yaml
   + staticPodPath: /etc/kubernetes/manifests
- 디렉토리 수정 시 kubelet 데몬 재실행
   + #systemctl restart kubelet

---

## Pod Resource 요청 및 제한
- Resource Requests
   + 파드를 실행하기 위한 최소 리소스 양을 요청
- Resource Limits
   + 파드가 사용할 수 있는 최대 리소스 양을 제한
   + Memory limit을 초과해서 사용되는 파드는 종료(OOM Kill)되며 다시 스케줄링 됨
   + https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/

---
 
## ReplicationController
- 요구하는 Pod의 개수를 보장하며 파드 집합의 실행을 항상 안정적으로 유지하는 것을 목표
   + 요구하는 Pod의 개수가 부족하면 template을 이용해 Pod를 추가
   + 요구하는 Pod 수보다 많으면 최근에 생성된 Pod를 삭제
- 기본구성
   + selector
   + replicas
   + template
```
apiVersion: v1
kind: ReplicationController
metadata:
  name: <RC_이름>
spec:
  replicas: <배포개수>   
  selector:
    key: value
  template:
    <컨테이너 템플릿>
    ...
```  

## ReplicaSet
- ReplicationController와 같은 역할을 하는 컨트롤러
- ReplicationController 보다 풍부한 selector
```
  selector:
    matchLabels:
      component: redis
    matchExpressions:
      - {key: tier, operator: In, values: [cache]}
      - {key: environment, operator: NotIn, values: [dev]}
```
- matchExpressions 연산자 
   + In: key와 values를 지정하여 key, value가 일치하는 Pod만 연결
   + NotIn: key는 일치하고 value는 일치하지 않는 Pod에 연결
   + Exists: key에 맞는 label의 pod를 연결
   + DoesNotExist: key와 다른 label의 pod를 연결 

## Deployment
   - ReplicaSet을 컨트롤해서 Pod수를 조절
   - Rolling Update & Rolling Back
      + `rolling update: 파드 인스턴스를 점진적으로 새로운 것으로 업데이트 하여 디플로이먼트 업데이트가 서비스 중단 없이 이루어질 수 있도록 해줌`

>#### POD 이름
> - pod api를 실행시 pod이름 사용
> - deploy, rc를 통해 pod 실행시 deploy/rc이름 사용
>#### Labels: 는 별도로 pod를 분류하고 관리할 목적으로 사용

## DaemonSet
- 전체 노드에서 Pod가 한 개씩 실행되도록 보장
- 로그 수입기, 모니터링 에이전트와 같은 프로그램 실행 시 적용

## Job
- Kubernetes는 Pod를 running 중인 상태로 유지
- Batch 처리하는 Pod는 작업이 완료되면 종료됨
- Batch 처리에 적합한 컨트롤러로 Pod의 성공적인 완료를 보장
   + 비정상 종료 시 다시 실행
   + 정상 종료 시 완료
      - completions: 실행해야 할 job의 수가 몇 개인지 지정
      - parallelism: 병렬성, 동시 running 되는 pod 수
      - activeDeadlineSeconds: 지정 시간 내에 Job을 완료

## CronJob
- job 컨트롤러로 실행할 Application Pod를 주기적으로 반복해서 실행
- Linux의 cronjob의 스케줄링 기능을 Job Controller에 추가한 API
- 다음과 같은 반복해서 실행하는 Job을 운영해야 할 때 사용
   + Data Backup
   + Send email
   + cleaning tasks
- Cronjob Schedule: "0 3 1 * *"
   + Minutes (from 0 to 59)
   + Hours (from 0 to 23)
   + Day of month (from 1 to 31)
   + Month (from 1 to 12)
   + Day of the week (from 0 to 6)
      - 매월 1일 9시 정각에 job 실행: 0 9 1 * * 
      - 매주 일요일 3시에 job 실행: 0 3 * * 0
      - 주중 3시에 job 실행: 0 3 * * 1-5
      - 주말 3시에 job 실행: 0 3 * * 0,6
      - job을 5분에 한 번씩 실행: */5 * * * *
         + job을 1분에 한 번씩 실행: * * * * *  
      - job을 2시간에 한 번씩 실행: 0 */2 * * * 

---

## Kubernetes Service
- 동일한 서비스를 제공하는 Pod 그룹의 단일 진입점을 제공

## Service type
- 4가지 Type 지원
   + ClusterIP(default)
      - Pod 가룹의 단일 진입점(Virtual IP) 생성
   + NodePort
      - ClusterIP가 생성된 후 
      - 모든 Worker Node에 외부에서 접속 가능한 포트가 예약
   + LoadBalancer
      - 클라우드 인프라스트럭처(AWS, Auzer, GCP 등)나 오픈스택 클라우드에 적용
      - LoadBalancer를 자동으로 프로 비전하는 기능 지원
   + ExternalName
      - 클러스터 안에서 외부에 접속 시 사용할 도메인을 등록해서 사용
      - 클러스터 도메인이 실제 외부 도메인으로 치환되어 동작 

### ClusterIP
- selector의 label이 동일한 파드들의 그룹으로 묶어 단일 진입점(Virtual IP)을 생성
- 클러스터 내부에서만 사용 가능
- type 생략시 default 값으로 10.96.0.0/12 범위에서 할당됨
   + `고정시키지 않는 이유: 충돌을 예방하기 위해`

### NodePort
- 모든 노드를 대상으로 외부 접속 가능한 포트를 예약
- Default NodePort 범위: 30000-32767
- ClusterIP를 생성 후 NodePort를 예약

### LoadBalancer
- Public 클라우드(AWS, Azure, GCP 등)에서 운영가능
- LoadBalancer를 자동으로 구성 요청
- NodePort를 예약 후 해당 nodeport로 외부 접근을 허용

### ExternalName
- 클러스터 내부에서 External(외부)의 도메인을 설정

### Headless Service
- ClusterIP가 없는 서비스로 단일 진입점이 필요 없을 때 사용
- Service와 연결된 Pod의 endpoint로 DNS 레코드가 생성됨
- Pod의 DNS 주소: pod-ip-addr.namespace.pod.cluster.local

## kube-proxy
- Kubernetes Service의 backend 구현
- endpotin 연결을 위한 iptables 구성
- nodePort로의 접근과 Pod 연결을 구현(iptables 구성)

### kube-proxy-mode
- userspace
   + 클라이언트의 서비스 요청을 iptables를 거쳐 kube-proxy가 받아서 연결
   + kubernetes 초기버전에 잠깐 사용
- iptables
   + default kubernetes network mode
   + kube-proxy는 service API 요청 시 iptables rule이 생성
   + 크라이언트 연결은 kube-proxy가 받아서 iptables 룰을 통해 연결
- IPVS
   + 리눅스 커널이 지원하는 L4 로드밸런싱 기술을 이용
   + 별도의 ipvs 지원 모듈을 설정한 후 적용 가능
   + 지원 알고리즘: rr(round-robin), lc(least connection), dh(destination hashing), sh(source hashing), sed(shortest expected delay), nc(net queue)

   ---

   ## Kubernetes Ingress
   - HTTP나 HTTPS를 통해 클러스터 내부의 서비스를 외부로 노출
   - Service에 외부 URL을 제공
   - 트래픽을 로드밸런싱
   - SSL 인증서 처리
   - Virtual hosting을 지정

<img src="https://d33wubrfki0l68.cloudfront.net/91ace4ec5dd0260386e71960638243cf902f8206/c3c52/docs/images/ingress.svg">

## Label
- Node를 포함하여 pod, deployment 등 모든 리소스에 할당
- 리소스의 특성을 분류하고, Selector를 이용해서 선택
- Key-value 한 쌍으로 적용
- https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/

```
# label 명이 같은 pod를 출력
$ kubectl get pods -l name = [label 명]

# 이미 존재하는 label 위에 덮어쓰기
$ --ovewrite

# label 삭제
$ label 명 뒤에 - (대시문자)
```
- Lable 보기
   + kubectl ge pods --show-labels
   + kubectl get pods -l <label_name>

- Label 관리: kubectl label --help
   + Label 생성 및 변경
      - kubectl label pod <name> key=value
      - kubectl label pod <name> key=value --overwrite
   + Label 확인
      - kubectl label pod <name> --show-labels
   + Label 제거
      - kubectl label pod <name> key-

### Node Label 
- Worker Node의 특성을 Label로 설정
   + kubectl label nodes <노드 이름> <레이블 키> = <레이블 값>
 -노드를 선택해서 파드를 배치할 수 있음  
---

<br/>
 

# kubernetes 설치
## 1. docker 설치
 > master node와 worker node에서 실행

### 1.1. package index 업데이트
```
# apt update
```

### 1.2. package dependencies 설치
```
# apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
```

### 1.3. doocker official GPG key 내려받기
```
# curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

### 1.4. packages repository 설정 및 package index 업데이트
```
# echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
# apt update
```
### 1.5. 설치 가능한 docker 버전 조회
```
# apt-cache madison docker-ce

---
 docker-ce | 5:23.0.1-1~ubuntu.18.04~bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:23.0.0-1~ubuntu.18.04~bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.23~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.22~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.21~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.20~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.19~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.18~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.17~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.16~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.15~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.14~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.13~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.12~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.11~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.10~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.9~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.8~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.7~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.6~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.5~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.4~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.3~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
 docker-ce | 5:20.10.2~3-0~ubuntu-bionic | https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
...

```

### 1.6. docker 엔진(engine) 설치
```
# apt install -y docker-ce=5:23.0.1-1~ubuntu.18.04~bionic docker-ce-cli=5:23.0.1-1~ubuntu.18.04~bionic containerd.io
```

### 1.7. docker 설치 확인
#### 1.7.1. docker 테스트 이미지(image) 실행
```
# docker run hello-world
```

#### 1.7.2. docker container 목록 조회
```
# docker ps -a
CONTAINER ID   IMAGE         COMMAND    CREATED         STATUS                     PORTS     NAMES
c99c288f08f5   hello-world   "/hello"   6 seconds ago   Exited (0) 5 seconds ago             affectionate_rhodes
```

#### 1.7.3. docker 버전 확인
```
# docker -v
Docker version 23.0.1, build a5ee5b1
```

## 2. package로 kubeadm, kubelet, kubectl 설치

### 2.1. package index 업데이트
```
# apt update
```

### 2.2. package dependencies 설치
```
# apt install -y apt-transport-https ca-certificates curl
```
### 2.3. Google Cloud public signing key 내려받기
```
# curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
```

### 2.4. packages repository 설정 및 package index 업데이트
```
# echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | tee /etc/apt/sources.list.d/kubernetes.list
# apt update
```

### 2.5. kubelet, kubeadm, kubectl 설치
```
# apt install -y kubelet kubeadm kubectl
```

### 2.6. kubelet, kubeadm, kubectl 버전 유지 설정
```
# apt-mark hold kubelet kubeadm kubectl
```

### 2.7. kubelet, kubeadm, kubectl 설치 확인
#### 2.7.1. kubelet 버전 확인
```
# kubelet --version
Kubernetes v1.26.2
```

#### 2.7.2. kubeadm 버전 확인
```
# kubeadm version
kubeadm version: &version.Info{Major:"1", Minor:"26", GitVersion:"v1.26.2", GitCommit:"fc04e732bb3e7198d2fa44efa5457c7c6f8c0f5b", GitTreeState:"clean", BuildDate:"2023-02-22T13:37:39Z", GoVersion:"go1.19.6", Compiler:"gc", Platform:"linux/amd64"}
```

#### 2.7.3. kubectl 버전 확인
```
# kubectl version
WARNING: This version information is deprecated and will be replaced with the output from kubectl version --short.  Use --output=yaml|json to get the full version.
Client Version: version.Info{Major:"1", Minor:"26", GitVersion:"v1.26.2", GitCommit:"fc04e732bb3e7198d2fa44efa5457c7c6f8c0f5b", GitTreeState:"clean", BuildDate:"2023-02-22T13:39:03Z", GoVersion:"go1.19.6", Compiler:"gc", Platform:"linux/amd64"}
Kustomize Version: v4.5.7
The connection to the server localhost:8080 was refused - did you specify the right host or port?
```

## container cri 관련 설정 주석 처리 
```
# sed -i '/"cri"/ s/^/#/' /etc/containerd/config.toml
```


## 3. master node에 kubeadm 설치
> master에서 실행

### 3.1. kubeadm init 명령어로 master node 초기화 (initializing)
```
# kubeadm init --pod-network-cidr=10.244.0.0/16
```

#### 3.1.1. 'kubeadm join' 명령어 별도 저장
```
초기화 완료 후 아래와 같이 화면 하단에 출력되는 명령어는 worker node 연결을 위해 필요하므로 별도로 저장

kubeadm join 10.0.20.16:6443 --token dti1ij.cb5qfvxm3qda1pol \
	--discovery-token-ca-cert-hash sha256:2ebedfd117c377b674e3dc9c03ce59f60428efce55c86b2fec093228c704ddf5
```

### 3.2. kubectl 설정
```
# mkdir -p $HOME/.kube
# cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
# chown $(id -u):$(id -g) $HOME/.kube/config
```

### 3.3. master node의 pod 목록 조회
> 아래 결과는 flannel 설치 전이기 때문에 coredns pod가 pending상태
```
root@master:/home/ubuntu# kubectl get pods -n kube-system
NAME                             READY   STATUS              RESTARTS   AGE
coredns-787d4945fb-fvlf7         0/1     ContainerCreating   0          47s
coredns-787d4945fb-vlhjm         0/1     ContainerCreating   0          47s
etcd-master                      1/1     Running             0          62s
kube-apiserver-master            1/1     Running             0          61s
kube-controller-manager-master   1/1     Running             0          61s
kube-proxy-szcd2                 1/1     Running             0          47s
kube-scheduler-master            1/1     Running             0          62s
```

### 3.4. flannel 설치
```
# kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
```

### 3.5. flannel 설치 확인
```
root@master:/home/ubuntu# kubectl get pods -n kube-system
NAME                             READY   STATUS    RESTARTS   AGE
coredns-787d4945fb-fvlf7         1/1     Running   0          95s
coredns-787d4945fb-vlhjm         1/1     Running   0          95s
etcd-master                      1/1     Running   0          110s
kube-apiserver-master            1/1     Running   0          109s
kube-controller-manager-master   1/1     Running   0          109s
kube-proxy-szcd2                 1/1     Running   0          95s
kube-scheduler-master            1/1     Running   0          110s
```

## 4. worker node를 master node에 연결
> worker node에서 실행

### 4.1. !kubeadm join 명령어로 worker node를 master node에 연결
```
root@worker1:/home/ubuntu# kubeadm join 10.0.20.16:6443 --token dti1ij.cb5qfvxm3qda1pol \
> .--discovery-token-ca-cert-hash sha256:2ebedfd117c377b674e3dc9c03ce59f60428efce55c86b2fec093228c704ddf5 
accepts at most 1 arg(s), received 3
To see the stack trace of this error execute with --v=5 or higher
```

#### 4.1.1. kubeadm join 진행 시 에러 해결 방법
> master node에서 진행
```
root@master:/home/ubuntu# kubeadm token create --print-join-command
kubeadm join 10.0.20.16:6443 --token dy94o2.den2fs818hgtpvpm --discovery-token-ca-cert-hash sha256:2ebedfd117c377b674e3dc9c03ce59f60428efce55c86b2fec093228c704ddf5
```

#### 4.1.2. kubeadm join 진행 시 정상 결과 화면
```
root@worker1:/home/ubuntu# kubeadm join 10.0.20.16:6443 --token dy94o2.den2fs818hgtpvpm --discovery-token-ca-cert-hash sha256:2ebedfd117c377b674e3dc9c03ce59f60428efce55c86b2fec093228c704ddf5
[preflight] Running pre-flight checks
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Starting the kubelet
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
```

## 5. kubernetes cluster 설치 확인
> master에서 진행

### 5.1. 전체 nodes 조회
```
root@master:/home/ubuntu# kubectl get nodes -o wide
NAME      STATUS   ROLES           AGE   VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION       CONTAINER-RUNTIME
master    Ready    control-plane   16m   v1.26.2   10.0.20.16    <none>        Ubuntu 18.04.6 LTS   4.15.0-197-generic   containerd://1.6.18
worker1   Ready    <none>          14m   v1.26.2   10.0.20.17    <none>        Ubuntu 18.04.6 LTS   4.15.0-197-generic   containerd://1.6.18
worker2   Ready    <none>          13m   v1.26.2   10.0.20.18    <none>        Ubuntu 18.04.6 LTS   4.15.0-197-generic   containerd://1.6.18
```

---
## 요약 
> 참고: https://subicura.com/2019/05/19/kubernetes-basic-1.html

컨테이너와 관련된 많은 예제가 웹(프론트엔드+백엔드) 애플리케이션을 다루고 있지만, 실제 세상엔 더 다양한 형태의 애플리케이션이 있습니다. 
쿠버네티스는 Deployment, StatefulSets, DaemonSet, Job, CronJob등 다양한 배포 방식을 지원합니다. 
Deployment는 새로운 버전의 애플리케이션을 다양한 전략으로 무중단 배포할 수 있습니다. 
StatefulSets은 실행 순서를 보장하고 호스트 이름과 볼륨을 일정하게 사용할 수 있어 순서나 데이터가 중요한 경우에 사용할 수 있습니다. 
로그나 모니터링 등 모든 노드에 설치가 필요한 경우엔 DaemonSet을 이용하고 배치성 작업은 Job이나 CronJob을 이용하면 됩니다