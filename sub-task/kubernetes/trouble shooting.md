## 자동 완성 실행 안됨
```
root@master:~/workspace# kubectl ge_get_comp_words_by_ref: command not found
_get_comp_words_by_ref: command not found
```

### 해결
```
root@master:~/workspace# echo 'alias k=kubectl' >>~/.bashrc
root@master:~/workspace# echo 'complete -o default -F __start_kubectl k' >>~/.bashrc
root@master:~/workspace# source /usr/share/bash-completion/bash_completion
```

## nfs 서버 연결 시 에러
```
mariadb-6cbdcbd779-wqf8t   0/1     ContainerCreating   0          5m8s
root@master:/home/ubuntu/workspace/mariadb# k describe pod mariadb-6cbdcbd779-wqf8t 
Name:             mariadb-6cbdcbd779-wqf8t
Namespace:        default
Priority:         0
Service Account:  default
Node:             worker1/10.0.20.17
Start Time:       Mon, 20 Mar 2023 08:03:52 +0000
Labels:           app=mariadb
                  pod-template-hash=6cbdcbd779
Annotations:      <none>
Status:           Pending
IP:               
IPs:              <none>
Controlled By:    ReplicaSet/mariadb-6cbdcbd779
Containers:
  mariadb:
    Container ID:   
    Image:          mariadb:10.7
    Image ID:       
    Port:           3306/TCP
    Host Port:      0/TCP
    State:          Waiting
      Reason:       ContainerCreating
    Ready:          False
    Restart Count:  0
    Environment:
      MYSQL_ROOT_PASSWORD:  <set to the key 'password' in secret 'mariadb-secret'>  Optional: false
    Mounts:
      /docker-entrypoint-initdb.d from mariadb-persistent-storage (rw)
      /var/lib/mysql from mairadb-data (rw,path="mysql")
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-8ngh8 (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             False 
  ContainersReady   False 
  PodScheduled      True 
Volumes:
  mariadb-persistent-storage:
    Type:      ConfigMap (a volume populated by a ConfigMap)
    Name:      mariadb-initdb-config
    Optional:  false
  mairadb-data:
    Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
    ClaimName:  mariadb-pv-claim
    ReadOnly:   false
  kube-api-access-8ngh8:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    ConfigMapOptional:       <nil>
    DownwardAPI:             true
QoS Class:                   BestEffort
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type     Reason       Age                   From               Message
  ----     ------       ----                  ----               -------
  Normal   Scheduled    5m15s                 default-scheduler  Successfully assigned default/mariadb-6cbdcbd779-wqf8t to worker1
  Warning  FailedMount  65s (x10 over 5m15s)  kubelet            MountVolume.SetUp failed for volume "mariadb-pv-volume" : mount failed: exit status 32
Mounting command: mount
Mounting arguments: -t nfs 10.0.20.19:/home/share/nfs /var/lib/kubelet/pods/1e2cd8e4-75e6-4d34-b36f-7e09d1306973/volumes/kubernetes.io~nfs/mariadb-pv-volume
Output: mount: /var/lib/kubelet/pods/1e2cd8e4-75e6-4d34-b36f-7e09d1306973/volumes/kubernetes.io~nfs/mariadb-pv-volume: bad option; for several filesystems (e.g. nfs, cifs) you might need a /sbin/mount.<type> helper program.
  Warning  FailedMount  54s (x2 over 3m12s)  kubelet  Unable to attach or mount volumes: unmounted volumes=[mairadb-data], unattached volumes=[mariadb-persistent-storage mairadb-data kube-api-access-8ngh8]: timed out waiting for the condition
```

### nfs 추가 패기지 설치 필요
```
root@master:/home/ubuntu/workspace/mariadb# apt-get install nfs-common 
```