# bosh

## paasta lock

### bosh inception 접속 후 reboot
```
$ sudo reboot now
```

## bosh 접속 시 인증서 중복
```
.../bosh $ ssh jumpbox@10.160.61.6 -i jumpbox.key
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ECDSA key sent by the remote host is
SHA256:J3Er6ZI3+kq1qNz1HENbTcnuIvqvByFfZapIZ8mnj8k.
Please contact your system administrator.
Add correct host key in /home/ubuntu/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in /home/ubuntu/.ssh/known_hosts:1
  remove with:
  ssh-keygen -f "/home/ubuntu/.ssh/known_hosts" -R "10.160.61.6"
ECDSA host key for 10.160.61.6 has changed and you have requested strict checking.
Host key verification failed.
```
### 1. 오류 메시지 명령어대로 수행
- $ ssh-keygen -f "/home/ubuntu/.ssh/known_hosts" -R "10.160.61.6"
- $ ssh jumpbox@10.160.61.6 -i jumpbox.key

### 2. 오류 메시지 해당 경로 파일 삭제
- Offending ECDSA key in /home/ubuntu/.ssh/known_hosts:1
- $ vim /home/ubuntu/.ssh/known_hosts:1 
   + 1번 라인 삭제 
- $ ssh jumpbox@10.160.61.6 -i jumpbox.key

## interpolate
- 배포 소스에 입력해두면 배포는 되지 않고 배포가 될 때 yml 파일을 화면에 보여줌
```
ubuntu@ubuntu:~/workspace/paasta-deployment/paasta$ cat interpolate-vsphere.sh 
#!/bin/bash

BOSH_ENVIRONMENT="${BOSH_ENVIRONMENT}"			 # bosh director alias name (PaaS-TA에서 제공되는 create-bosh-login.sh 미 사용시 bosh envs에서 이름을 확인하여 입력)

bosh -e ${BOSH_ENVIRONMENT} -d paasta -n interpolate paasta-deployment.yml \
	-o operations/use-haproxy.yml \
	-o operations/use-haproxy-public-network-vsphere.yml \
	-o operations/use-postgres.yml \
	-o operations/rename-network-and-deployment.yml \
	-l vars.yml \
	-l ../../common/common_vars.yml \
        -o operations/cce.yml \
	-o operations/cce-check.yml
```