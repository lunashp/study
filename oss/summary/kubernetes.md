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
