# CCE shell script

>## UAA
```
#!/bin/sh

LANG=C
export LANG
alias ls=ls

#################################################################################
# 변수 설정
#################################################################################
AP_STR="LUNA_UAA"

HOST_NAME=`hostname`
DATE_STR=`date +%m%d`

echo " 해당 시스템의 IP 주소를 입력해주세요."
while true
do 
   echo -n "    (ex. 192.168.0.1) : " 
   read IPINFO
   #'.'이 3개이면 통과
   if [ $(echo $IPINFO | tr -d -c '.' | wc -m) -eq 3 ]
      then
		 break
      else
         echo "잘못 입력하셨습니다. 다시 입력해주세요."
         echo ""
   fi
done

RESULT_FILE=$AP_STR"_"$HOST_NAME"_"$IPINFO"_"$DATE_STR".txt"

# echo "[BU-01] 계정 잠금 임계값 설정"
echo "[ID] : BU-01" >> $RESULT_FILE 2>&1
echo "[Result] : Info" >> $RESULT_FILE 2>&1
echo "[Comment] : " >> $RESULT_FILE 2>&1
sudo cat /var/vcap/jobs/uaa/config/uaa.yml | grep lockoutAfterFailures >> $RESULT_FILE 2>&1
echo "" >> $RESULT_FILE 2>&1
echo "[Check]" >> $RESULT_FILE 2>&1
echo "*계정 잠금 임계값 설정이 5회 이하로 설정된 경우 양호" >> $RESULT_FILE 2>&1


echo "" >> $RESULT_FILE 2>&1
echo "======================================================================================"  >> $RESULT_FILE 2>&1
echo "" >> $RESULT_FILE 2>&1

# echo "[BU-02] 패스워드 복잡도 설정"
echo "[ID] : BU-02" >> $RESULT_FILE 2>&1
echo "[Result] : Info" >> $RESULT_FILE 2>&1
echo "[Comment] : " >> $RESULT_FILE 2>&1
sudo grep -A40 'client:' /var/vcap/jobs/uaa/config/uaa.yml | grep -A30 'secret:' | grep -A20 -B20 'policy:' | grep -A10 -B10 'global:' >> $RESULT_FILE 2>&1
echo "" >> $RESULT_FILE 2>&1
echo "[Check]" >> $RESULT_FILE 2>&1
echo "*패스워드 복잡도 설정(영어 대/소문자, 특수문자, 숫자 중 3가지 조합 8자리 이상 또는 2가지 조
합 10자리 이상)이 적용된 경우 양호" >> $RESULT_FILE 2>&1


echo "" >> $RESULT_FILE 2>&1
echo "======================================================================================"  >> $RESULT_FILE 2>&1
echo "" >> $RESULT_FILE 2>&1

# echo "[BU-03] 세션 타임아웃 설정"
echo "[ID] : BU-03" >> $RESULT_FILE 2>&1
echo "[Result] : Info" >> $RESULT_FILE 2>&1
echo "[Comment] : " >> $RESULT_FILE 2>&1
sudo cat /var/vcap/jobs/uaa/config/uaa.yml | grep idle-timeout >> $RESULT_FILE 2>&1
echo "" >> $RESULT_FILE 2>&1
echo "[Check]" >> $RESULT_FILE 2>&1
echo "*세션 타임아웃 설정이 10분 이하로 설정된 경우 양호" >> $RESULT_FILE 2>&1


echo "" >> $RESULT_FILE 2>&1
echo "======================================================================================"  >> $RESULT_FILE 2>&1
echo "" >> $RESULT_FILE 2>&1

# echo "[BU-04] https 사용 여부 확인"
echo "[ID] : BU-04" >> $RESULT_FILE 2>&1
echo "[Result] : Info" >> $RESULT_FILE 2>&1
echo "[Comment] : " >> $RESULT_FILE 2>&1
sudo grep -A120 'oauth:' /var/vcap/jobs/uaa/config/uaa.yml | grep -A10 'authorize:' | grep -B2 'ssl:' >> $RESULT_FILE 2>&1
echo "" >> $RESULT_FILE 2>&1
echo "[Check]" >> $RESULT_FILE 2>&1
echo "*https 사용하는 경우 양호" >> $RESULT_FILE 2>&1


echo "" >> $RESULT_FILE 2>&1
echo "======================================================================================"  >> $RESULT_FILE 2>&1
echo "" >> $RESULT_FILE 2>&1

# echo "[BU-05]  로그 설정"
echo "[ID] : BU-05" >> $RESULT_FILE 2>&1
echo "[Result] : Info" >> $RESULT_FILE 2>&1
echo "[Comment] : " >> $RESULT_FILE 2>&1
sudo cat /var/vcap/jobs/uaa/config/uaa.yml | grep -A1 'logging:' >> $RESULT_FILE 2>&1
sudo cat /var/vcap/jobs/uaa/config/log4j2.properties | grep logger.*.level >> $RESULT_FILE 2>&1
echo "" >> $RESULT_FILE 2>&1
echo "[Check]" >> $RESULT_FILE 2>&1
echo "*로깅 레벨(INFO 이상)이 적용된 경우 양호" >> $RESULT_FILE 2>&1


echo "" >> $RESULT_FILE 2>&1
echo "======================================================================================"  >> $RESULT_FILE 2>&1
echo "" >> $RESULT_FILE 2>&1

# echo "[BU-06]  최신 패치 적용"
echo "[ID] : BU-06" >> $RESULT_FILE 2>&1
echo "[Result] : Info" >> $RESULT_FILE 2>&1
echo "[Comment] : " >> $RESULT_FILE 2>&1

echo "" >> $RESULT_FILE 2>&1
echo "[Check]" >> $RESULT_FILE 2>&1
echo "*최신 패치 및 보안 업데이트를 적용한 경우" >> $RESULT_FILE 2>&1


echo "" >> $RESULT_FILE 2>&1
echo "======================================================================================"  >> $RESULT_FILE 2>&1
echo "" >> $RESULT_FILE 2>&1
```
- BU-06 명령어는 VM 밖에서 실행하기 때문에 스크립트 보완 필요
    + $ bosh ds | grep uaa

---

>## Linux_info
```
#!/bin/sh

LANG=C
export LANG
alias ls=ls

#################################################################################
# 변수 설정
#################################################################################
AP_STR="LUNA_linux"

HOST_NAME=`hostname`
DATE_STR=`date +%m%d`

echo " 해당 시스템의 IP 주소를 입력해주세요."
while true
do 
   echo -n "    (ex. 192.168.0.1) : " 
   read IPINFO
   #'.'이 3개이면 통과
   if [ $(echo $IPINFO | tr -d -c '.' | wc -m) -eq 3 ]
      then
		 break
      else
         echo "잘못 입력하셨습니다. 다시 입력해주세요."
         echo ""
   fi
done

RESULT_FILE=$AP_STR"_"$HOST_NAME"_"$IPINFO"_"$DATE_STR".txt"

# echo "[U-07] 파일 및 디렉터리 소유자 설정"
echo "[ID] : U-07" >> $RESULT_FILE 2>&1
echo "[Result] : Info" >> $RESULT_FILE 2>&1
echo "[Comment] : " >> $RESULT_FILE 2>&1
echo "$ sudo find / -nouser -o -nogroup" >> $RESULT_FILE 2>&1
sudo find / -nouser -o -nogroup >> $RESULT_FILE 2>&1
echo "" >> $RESULT_FILE 2>&1
echo "[Check]" >> $RESULT_FILE 2>&1
echo "*소유자 그룹이 존재하지 않는 파일 및 디렉터리가 없는 경우 양호" >> $RESULT_FILE 2>&1


echo "" >> $RESULT_FILE 2>&1
echo "======================================================================================"  >> $RESULT_FILE 2>&1
echo "" >> $RESULT_FILE 2>&1


# echo "[U-11] /etc/(x)inetd.conf 파일 소유자 및 권한 설정"
echo "[ID] : U-11" >> $RESULT_FILE 2>&1
echo "[Result] : Info" >> $RESULT_FILE 2>&1
echo "[Comment] : " >> $RESULT_FILE 2>&1
echo "$ sudo find / -name *inetd.conf;" >> $RESULT_FILE 2>&1
sudo find / -name *inetd.conf;  >> $RESULT_FILE 2>&1 
echo "" >> $RESULT_FILE 2>&1
echo "[Check]" >> $RESULT_FILE 2>&1
echo "*/etc/(x)inetd.conf 파일의 소유자가 root이고, 권한이 644인 경우 양호" >> $RESULT_FILE 2>&1


echo "" >> $RESULT_FILE 2>&1
echo "======================================================================================"  >> $RESULT_FILE 2>&1
echo "" >> $RESULT_FILE 2>&1

# echo "[U-16] world writable 파일 점검"
echo "[ID] : U-16" >> $RESULT_FILE 2>&1
echo "[Result] : Info" >> $RESULT_FILE 2>&1
echo "[Comment] : " >> $RESULT_FILE 2>&1
echo "$ sudo find / -type f -perm -2 -exec ls -l {} \;" >> $RESULT_FILE 2>&1
sudo find / -type f -perm -2 -exec ls -l {} \; >> $RESULT_FILE 2>&1
echo "" >> $RESULT_FILE 2>&1
echo "[Check]" >> $RESULT_FILE 2>&1
echo "*world writable 파일이 존재하지 않거나, 존재 시 설정 이유를 확인하고 있는 경우 양호" >> $RESULT_FILE 2>&1


echo "" >> $RESULT_FILE 2>&1
echo "======================================================================================"  >> $RESULT_FILE 2>&1
echo "" >> $RESULT_FILE 2>&1
```
- U-16 | 으로 이루어지는 명령어가 shell 에서 작동안함, 스크립트 보완필요
   + $ sudo find / -type f -perm -2 -exec ls -l {} \; | grep -Ev 'cce.tgz|/proc' | tail -n 10;