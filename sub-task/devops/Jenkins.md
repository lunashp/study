# Jenkins 설치 (ubuntu 20.04)

## 1. apt-get 업데이트
```
apt-get update
```

## 2. JDK 설치
```
sudo apt-get install openjdk-11-jdk
```

## 3. Jenkins 저장소 Key 다운로드
```
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
```

## 4. sources.list.d 에 jenkins.list 추가
```
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
```

## 5. Key 등록 (생략)
```
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys FCEF32E745F2C3D5
```

## 6. apt-get 재 업데이트
```
sudo apt-get update
```

## 7. Jenkins 설치
```
sudo apt-get install jenkins
```

## 8. Jenkins 서버 포트 번호 변경
```
sudo vi /etc/default/jenkins
```
```
# port for HTTP connector (default 8080; disable with -1)
HTTP_PORT=8080
```

## 9. Jenkins 서비스 재기동 
```
sudo service jenkins restart
```

## 10. Jenkins 서비스 상태 확인
```
sudo systemctl status jenkins
```

## 11. Jenkins 초기 비밀번호 확인
```
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

## 12. Jenkins 사이트로 이동 후 11번에서 확인한 비밀번호 입력

### 주소창에 http://[서버URL]:[포트] URL을 입력해 젠킨스에 접속
