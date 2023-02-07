# linux

## 정규 표현식

| 표현식 | 축약 표현 | 부연 설명 | 사용처 |
| --- | --- | --- | --- |
| [0-9] | \d | 숫자를 찾는다 | 숫자 |
| [^0-9] | \D | 숫자가 아닌 것을 찾는다 | 텍스트 + 특수문자 + 화이트스페이스 |
| [ \t\n\r\f\v] | \s | whitespace 문자인 것을 찾는다 | 스페이스, TAB, 개행(new line) |
| [^ \t\n\r\f\v] | \S | whitespace 문자가 아닌 것을 찾는다 | 텍스트 + 특수문자 + 숫자 |
| [a-zA-Z0-9] | \w | 문자+숫자인 것을 찾는다. (특수문자는 제외. 단, 언더스코어 포함) | 텍스트 + 숫자 |
| [^a-zA-Z0-9] | \W | 문자+숫자가 아닌 것을 찾는다. | 특수문자 + 공백 |

## 컴파일 옵션

| 옵션 이름 | 약어 | 설명 |
| --- | --- | --- |
| DOTALL | S | dot 문자(.)가 줄바꿈 문자를 포함하여 모든 문자와 매치한다. |
| IGNORECASE | I | 대소문자에 관계없이 매치한다. |
| MULTILINE | M | 여러 줄과 매치한다. (^, $ 메타 문자의 사용과 관계가 있는 옵션이다. |
| VERBOSE | X | verbose 모드를 사용한다. (정규식을 보기 편하게 만들 수도 있고 주석 등을 사용할 수도 있다.) |


## txt > xlsx
```
# -*- coding: utf-8 -*-
import pandas as pd
import re
import string

f = open("./test_data.txt", "rt", encoding="UTF-8")
txt_list = f.readlines()
f.close()
data = "".join(txt_list)


def get_preprocess_li(data):
    re_id = re.compile(r"\[ID\]: [\S]*\n", re.DOTALL)
    re_result = re.compile(r"\[Result\]: [\S]*\n", re.DOTALL)
    re_comment = re.compile(r"\[Comment\]: .*\n", re.DOTALL)

    split_list = data.split("======================================================================================")
    result_list = []
    os_version = []

    for sp in split_list:
        tmp_list = []
        id_txt = re_id.findall(sp)
        result_txt = re_result.findall(sp)
        comment_txt = re_comment.findall(sp)
        if (id_txt and result_txt and comment_txt):
            tmp_list.append(id_txt[0][6:-1])
            tmp_list.append(result_txt[0][10:-1])
            tmp_list.append(comment_txt[0][10:-1])
            for line in tmp_list:
                if 'DISTRIB_ID' in line:
                    os_version.append(line[153:159])
                    os_version.append(line[176:181])
                    lst_str = str(os_version)[1:-1]
                    print(lst_str)
                    tmp_list.append(lst_str)
            result_list.append(tmp_list)
            #print(result_list)
    return result_list



result_list = get_preprocess_li(data)
result_df = pd.DataFrame(result_list, columns=["ID", "취약", "진단|가이드 PAGE", "OS(SW)/버전"])
# result_df.replace(to_replace='Good', value='N', regex=True, inplace=True)
# result_df.replace({'Good':'N', 'Info':'E', 'Weak':'Y'}, inplace=True)
result_df.replace(['Good', 'Info', 'Weak'], ['N', 'E', 'Y'], inplace=True)

# 고정값
result_df["자산명"] = " "
result_df["호스트명"] = " "
result_df["진단항목"] = ['root 계정 원격 접속 제한','패스워드 복잡성 설정','계정 잠금 임계값 설정','패스워드 최대 사용 기간 설정','패스워드 파일 보호','root 홈, 패스 디렉터리 권한 및 패스 설정','파일 및 디렉터리 소유자 설정','	/etc/passwd 파일 소유자 및 권한 설정','	/etc/shadow 파일 소유자 및 권한 설정','/etc/hosts 파일 소유자 및 권한 설정','	/etc/(x)inetd.conf 파일 소유자 및 권한 설정','/etc/syslog.conf 파일 소유자 및 권한 설정','	/etc/services 파일 소유자 및 권한 설정','SUID, SGID, Sticky bit 설정 파일 점검','사용자, 시스템 시작파일 및 환경파일 소유자 및 권한 설정','world writable 파일 점검','$HOME/.rhosts, hosts.equiv 사용 금지','접속 IP 및 포트 제한','cron 파일 소유자 및 권한 설정','Finger 서비스 비활성화','Anonymous FTP 비활성화','r 계열 서비스 비활성화','DoS 공격에 취약한 서비스 비활성화','NFS 서비스 비활성화','NFS 접근통제','automountd 제거','RPC 서비스 확인','NIS, NIS+ 점검','tftp, talk 서비스 비활성화','Sendmail 버전 점검','	스팸 메일 릴레이 제한','일반사용자의 Sendmail 실행 방지','DNS 보안 버전 패치','DNS ZoneTransfer 설정','최신 보안패치 및 벤더 권고사항 적용','로그의 정기적 검토 및 보고']
result_df[" "] = [87, 89, 91, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 108, 110, 111, 112, 113, 114, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128]
result_df["조치방법"] = " "
result_df["정상 동작 확인 방법"] = " "
result_df["조치 확인"] = " "
result_df["비고"] = " "


# 고정값 넣고 컬럼 순서 재정렬
result_df = result_df[["취약", "자산명", "ID", "호스트명", "OS(SW)/버전", "진단항목", "진단|가이드 PAGE", " ", "조치방법", "정상 동작 확인 방법", "조치 확인", "비고"]]


# 단일 시트
result_df.to_excel("result.xlsx", sheet_name="Sheet1")
# 다중시트
with pd.ExcelWriter("result_multi.xlsx") as writer:
    result_df.to_excel(writer, sheet_name="Sheet1")
    result_df.to_excel(writer, sheet_name="Sheet2")
```
⇒ 결과 값(OS) `'Ubuntu', '18.04'`

- 수정 사항
    - 하나의 시트 (U-35) 에만 삽입됨
        - 당연함 여기서 for 문 돌림
    - ‘’ 제거 필요


## linux 에서 해당 .py 실행 시 패키지 설치 필요
```
sudo apt install python3
python3 -m pip install pandas
python3 -m pip install openpyxl
```

## trouble shooting1 :: 완료
```
ubuntu@ubuntu:~/workspace/user/luna$ ./linux_cce.py 
-bash: ./linux_cce.py: /usr/bin/python3^M: bad interpreter: No such file or directory
```
-> 개행문자(^M)를 UNIX 형식으로 지정해야 함

```
$ sed -i 's/\r$//' {파일명}.py

ubuntu@ubuntu:~/workspace/user/luna$ sed -i 's/\r$//' linux_cce.py 
```

## trouble shooting2 :: 완료
- 정확한 파일명이 아닌 *로 txt 파일 지정 시 아래와 같은 에러 발생
```
# -*- coding: utf-8 -*-
import pandas as pd
import re
import string

f = open("./test_data.txt", "rt", encoding="UTF-8")
txt_list = f.readlines()
f.close()
data = "".join(txt_list)

---
ubuntu@ubuntu:~/workspace/user/luna$ ./linux_cce.py 
Traceback (most recent call last):
  File "./linux_cce.py", line 8, in <module>
    f = open("./*.txt", "rt", encoding="UTF-8")
FileNotFoundError: [Errno 2] No such file or directory: './*.txt'
```
## 변경 코드
```
# -*- coding: utf-8 -*-
import pandas as pd
import re
import glob

for filename in glob.glob('*.txt'):
    f = open(filename, "rt", encoding="UTF-8")
    txt_list = f.readlines()
    f.close()
    data = "".join(txt_list)
```

## trouble shooting3 :: 완료
### 에러 상황
```
Task 599 | 04:22:37 | Error: Action Failed get_task: Task 31366a54-c712-4711-595f-c46622c31cc3 result: 1 of 2 post-deploy scripts failed. Failed Jobs: cce-common. Successful Jobs: post-deploy-script.

Task 599 Started  Tue Jan 10 03:55:42 UTC 2023
Task 599 Finished Tue Jan 10 04:22:37 UTC 2023
Task 599 Duration 00:26:55
Task 599 error

Updating deployment:
  Expected task '599' to succeed but state is 'error'

Exit code 1
```
### vm 접속 후 python script 실행 후 에러
```
mariadb/c3b76c63-fd0d-4fea-891d-296d413d98f2:/var/vcap/cce$ sudo ./linux_cce.py 
Traceback (most recent call last):
  File "./linux_cce.py", line 3, in <module>
    import pandas as pd
ModuleNotFoundError: No module named 'pandas'
```
### pip 명령어가 없는 것으로 확인
```
mariadb/c3b76c63-fd0d-4fea-891d-296d413d98f2:/var/vcap/cce$ python3 -m pip install pandas
/usr/bin/python3: No module named pip
mariadb/c3b76c63-fd0d-4fea-891d-296d413d98f2:/var/vcap/cce$ pip install pandas
-bash: pip: command not found
mariadb/c3b76c63-fd0d-4fea-891d-296d413d98f2:/var/vcap/cce$ sudo su 
mariadb/c3b76c63-fd0d-4fea-891d-296d413d98f2:/var/vcap/cce# python3 -m pip install pandas
/usr/bin/python3: No module named pip
mariadb/c3b76c63-fd0d-4fea-891d-296d413d98f2:/var/vcap/cce# pip --version
bash: pip: command not found
```
### pip 설치
```
sudo apt-get install python3-pip
```

### python3-pip 에러
```
   69  sudo apt-get install python3-pip
   70  sudo apt-get install python3-pip --fix-missing

Setting up python3-keyring (10.6.0-1) ...
Processing triggers for man-db (2.8.3-2ubuntu0.1) ...
E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/e/expat/libexpat1-dev_2.2.5-3ubuntu0.7_amd64.deb  404  Not Found [IP: 91.189.91.39 80]
E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/p/python3.6/libpython3.6-dev_3.6.9-1~18.04ubuntu1.8_amd64.deb  404  Not Found [IP: 91.189.91.39 80]
E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/p/python3.6/python3.6-dev_3.6.9-1~18.04ubuntu1.8_amd64.deb  404  Not Found [IP: 91.189.91.39 80]
```

### 필요 항목 설치 스크립트 생성
```
#!/bin/sh

sudo apt-get install -y python3-pip; sudo apt-get install -y python3-pip --fix-missing; sudo python3 -m pip install pandas; sudo python3 -m pip install openpyxl
```

### cce-check release에 적용 


## python code
```
#!/usr/bin/python3
# -*- coding: utf-8 -*-
import pandas as pd
import re
import glob

for filename in glob.glob('Linux*.txt'):
    f = open(filename, "rt", encoding="UTF-8")
    txt_list = f.readlines()
    f.close()
    data = "".join(txt_list)

def get_preprocess_li(data):
    re_id = re.compile(r"\[ID\]: [\S]*\n", re.DOTALL)
    re_result = re.compile(r"\[Result\]: [\S]*\n", re.DOTALL)
    re_comment = re.compile(r"\[Comment\]: .*\n", re.DOTALL)

    split_list = data.split("======================================================================================")
    result_list = []
    os_version = []

    for sp in split_list:
        tmp_list = []
        id_txt = re_id.findall(sp)
        result_txt = re_result.findall(sp)
        comment_txt = re_comment.findall(sp)
        if (id_txt and result_txt and comment_txt):
            tmp_list.append(id_txt[0][6:-1])
            tmp_list.append(result_txt[0][10:-1])
            tmp_list.append(comment_txt[0][10:-1])
            for line in tmp_list:
                if 'DISTRIB_ID' in line:
                    os_version.append(line[153:159])
                    os_version.append(line[176:181])
                    lst_str = str(os_version)[1:-1]
                    tmp_list.append(lst_str)
            result_list.append(tmp_list)
    return result_list


result_list = get_preprocess_li(data)
result_df = pd.DataFrame(result_list, columns=["ID", "취약", "진단|가이드 PAGE", "OS(SW)/버전"])
# result_df.replace(to_replace='Good', value='N', regex=True, inplace=True)
# result_df.replace({'Good':'N', 'Info':'E', 'Weak':'Y'}, inplace=True)
result_df.replace(['Good', 'Info', 'Weak'], ['N', 'E', 'Y'], inplace=True)

# 고정값
result_df["자산명"] = " "
result_df["호스트명"] = " "
result_df["진단항목"] = ['root 계정 원격 접속 제한','패스워드 복잡성 설정','계정 잠금 임계값 설정','패스워드 최대 사용 기간 설정','패스워드 파일 보호','root 홈, 패스 디렉터리 권한 및 패스 설정','파일 및 디렉터리 소유자 설정','	/etc/passwd 파일 소유자 및 권한 설정','	/etc/shadow 파일 소유자 및 권한 설정','/etc/hosts 파일 소유자 및 권한 설정',' /etc/(x)inetd.conf 파일 소유자 및 권한 설정','/etc/syslog.conf 파일 소유자 및 권한 설정','	/etc/services 파일 소유자 및 권한 설정','SUID, SGID, Sticky bit 설정 파일 점검','사용자, 시스템 시작파일 및 환경파일 소유자 및 권한 설정','world writable 파일 점검','$HOME/.rhosts, hosts.equiv 사용 금지','접속 IP 및 포트 제한','cron 파일 소유자 및 권한 설정','Finger 서비스 비활성화','Anonymous FTP 비활성화','r 계열 서비스 비활성화','DoS 공격에 취약한 서비스 비활성화','NFS 서비스 비활성화','NFS 접근통제','automountd 제거','RPC 서비스 확인','NIS, NIS+ 점검','tftp, talk 서비스 비활성화','Sendmail 버전 점검','	스팸 메일 릴레이 제한','일반사용자의 Sendmail 실행 방지','DNS 보안 버전 패치','DNS ZoneTransfer 설정','최신 보안패치 및 벤더 권고사항 적용','로그의 정기적 검토 및 보고']
result_df[" "] = [87, 89, 91, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 108, 110, 111, 112, 113, 114, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128]
result_df["조치방법"] = " "
result_df["정상 동작 확인 방법"] = " "
result_df["조치 확인"] = " "
result_df["비고"] = " "


# 고정값 넣고 컬럼 순서 재정렬
result_df = result_df[["취약", "자산명", "ID", "호스트명", "OS(SW)/버전", "진단항목", "진단|가이드 PAGE", " ", "조치방법", "정상 동작 확인 방법", "조치 확인", "비고"]]


# 단일 시트
result_df.to_excel("result.xlsx", sheet_name="Sheet1")
# 다중시트
with pd.ExcelWriter("result_multi.xlsx") as writer:
    result_df.to_excel(writer, sheet_name="Sheet1")
    result_df.to_excel(writer, sheet_name="Sheet2")
```

---

# MySQL
```
# -*- coding: utf-8 -*-
import pandas as pd
import re
import glob

for filename in glob.glob('./MySQL*.txt'):
    f = open(filename, "rt", encoding="UTF-8")
    txt_list = f.readlines()
    f.close()
    data = "".join(txt_list)

def get_preprocess_li(data):
    re_id = re.compile(r"\[ID\] : [\S]*\n", re.DOTALL)
    re_result = re.compile(r"\[Result\] : [\S]*\n", re.DOTALL)
    re_comment = re.compile(r"\[Comment\] : .*\n", re.DOTALL)

    split_list = data.split("======================================================================================")
    result_list = []
    for sp in split_list:
        tmp_list = []
        id_txt = re_id.findall(sp)
        result_txt = re_result.findall(sp)
        comment_txt = re_comment.findall(sp)
        print(comment_txt)
        if (id_txt and result_txt and comment_txt):
            tmp_list.append(id_txt[0][6:-1])
            tmp_list.append(result_txt[0][10:-1])
            tmp_list.append(comment_txt[0][10:-1])
            result_list.append(tmp_list)
            print(tmp_list)
    return result_list

result_list = get_preprocess_li(data)
result_df = pd.DataFrame(result_list, columns=["ID", "취약", "진단|가이드 PAGE"])
# result_df.replace(to_replace='Good', value='N', regex=True, inplace=True)
# result_df.replace({'Good':'N', 'Info':'E', 'Weak':'Y'}, inplace=True)
result_df.replace(['Good', 'Info', 'Weak'], ['N', 'E', 'Y'], inplace=True)

# 고정값
result_df["자산명"] = " "
result_df["호스트명"] = " "
result_df["OS(SW)/버전"] = "mariadb"
result_df["진단항목"] = ['불필요한 계정 제거','취약한 패스워드 사용제한','타사용자에 권한 부여 옵션 사용제한','DB 사용자 계정 정보 테이블 접근','root 권한으로 서버 구동 제한','환경설정 파일 접근 권한','안전한 암호화 알고리즘 사용','로그 활성화','최신패치 적용']
result_df[" "] = [252,253,254,255,256,257,258,259,260]
result_df["조치방법"] = " "
result_df["정상 동작 확인 방법"] = " "
result_df["조치 확인"] = " "
result_df["비고"] = " "



# 고정값 넣고 컬럼 순서 재정렬
result_df = result_df[["취약", "자산명", "ID", "호스트명", "OS(SW)/버전", "진단항목", "진단|가이드 PAGE", " ", "조치방법", "정상 동작 확인 방법", "조치 확인", "비고"]]


# 단일 시트
result_df.to_excel("result.xlsx", sheet_name="Sheet1")
# 다중시트
with pd.ExcelWriter("result_multi.xlsx") as writer:
    result_df.to_excel(writer, sheet_name="Sheet1")
    result_df.to_excel(writer, sheet_name="Sheet2")
```

## 에러확인
- txt 파일 정제 작업 필요로 예상 
```
[]
['[Comment] : \n# DBMS 계정 목록 조회\n+--------------------------------------+--------------+---------------------------------------------+\n| Host                                 | User         | authentication_string                       |\n+--------------------------------------+--------------+---------------------------------------------+\n| localhost                            | mariadb.sys  | MIDfPTqc59xa5AGJi/FNY/ydAnCA9bas0UkY/ln+r2o |\n| localhost                            | root         | MIDfPTqc59xa5AGJi/FNY/ydAnCA9bas0UkY/ln+r2o |\n| localhost                            | vcap         | MIDfPTqc59xa5AGJi/FNY/ydAnCA9bas0UkY/ln+r2o |\n| localhost                            |              |                                             |\n| b5484ee5-4a21-4a6f-8e45-f11376a2d60a |              |                                             |\n| %                                    | root         | MIDfPTqc59xa5AGJi/FNY/ydAnCA9bas0UkY/ln+r2o |\n| localhost                            | applifecycle | MvkMYwKe+gVg2Isp0VAXocR/EA+yVjEqAynYDUKndOg |\n| %                                    | applifecycle | MvkMYwKe+gVg2Isp0VAXocR/EA+yVjEqAynYDUKndOg |\n+--------------------------------------+--------------+---------------------------------------------+\n\n[Check]\n*DB 설치 시 Default로 생성되는 계정 및 테스트 계정, 의심스러운 계정, 불필요한 계정이 없으면 양호\n\n']
[' DY-01', ' Info', ': \n# DBMS 계정 목록 조회\n+--------------------------------------+--------------+---------------------------------------------+\n| Host                                 | User         | authentication_string                       |\n+--------------------------------------+--------------+---------------------------------------------+\n| localhost                            | mariadb.sys  | MIDfPTqc59xa5AGJi/FNY/ydAnCA9bas0UkY/ln+r2o |\n| localhost                            | root         | MIDfPTqc59xa5AGJi/FNY/ydAnCA9bas0UkY/ln+r2o |\n| localhost                            | vcap         | MIDfPTqc59xa5AGJi/FNY/ydAnCA9bas0UkY/ln+r2o |\n| localhost                            |              |                                             |\n| b5484ee5-4a21-4a6f-8e45-f11376a2d60a |              |                                             |\n| %                                    | root         | MIDfPTqc59xa5AGJi/FNY/ydAnCA9bas0UkY/ln+r2o |\n| localhost                            | applifecycle | MvkMYwKe+gVg2Isp0VAXocR/EA+yVjEqAynYDUKndOg |\n| %                                    | applifecycle | MvkMYwKe+gVg2Isp0VAXocR/EA+yVjEqAynYDUKndOg |\n+--------------------------------------+--------------+---------------------------------------------+\n\n[Check]\n*DB 설치 시 Default로 생성되는 계정 및 테스트 계정, 의심스러운 계정, 불필요한 계정이 없으면 양호\n']
['[Comment] : \n가. 사용자 계정과 패스워드가 동일한지 점검\n+--------------------------------------+------+\n| Host                                 | User |\n+--------------------------------------+------+\n| localhost                            |      |\n| b5484ee5-4a21-4a6f-8e45-f11376a2d60a |      |\n+--------------------------------------+------+\n\n나. 사용자 계정의 패스워드가 null인지 여부 점검\n+--------------------------------------+------+-----------------------+\n| Host                                 | User | authentication_string |\n+--------------------------------------+------+-----------------------+\n| localhost                            |      |                       |\n| b5484ee5-4a21-4a6f-8e45-f11376a2d60a |      |                       |\n+--------------------------------------+------+-----------------------+\n\n[Check] :\n*계정명과 동일하거나, 추측 가능한 패스워드를 사용하지 않으면 양호\n\n']
[' DY-02', ' Info', ': \n가. 사용자 계정과 패스워드가 동일한지 점검\n+--------------------------------------+------+\n| Host                                 | User |\n+--------------------------------------+------+\n| localhost                            |      |\n| b5484ee5-4a21-4a6f-8e45-f11376a2d60a |      |\n+--------------------------------------+------+\n\n나. 사용자 계정의 패스워드가 null인지 여부 점검\n+--------------------------------------+------+-----------------------+\n| Host                                 | User | authentication_string |\n+--------------------------------------+------+-----------------------+\n| localhost                            |      |                       |\n| b5484ee5-4a21-4a6f-8e45-f11376a2d60a |      |                       |\n+--------------------------------------+------+-----------------------+\n\n[Check] :\n*계정명과 동일하거나, 추측 가능한 패스워드를 사용하지 않으면 양호\n']
['[Comment] : \n# grant_priv을 부여 받은 사용자 조회\n+-----------+--------------+------------+\n| Host      | User         | Grant_priv |\n+-----------+--------------+------------+\n| localhost | root         | Y          |\n| localhost | vcap         | Y          |\n| %         | root         | Y          |\n| %         | applifecycle | Y          |\n+-----------+--------------+------------+\n\n[Check] : \n*grant_priv 권한이 적절한 사용자에게 부여되어 있으면 양호\n\n']
[' DY-03', ' Info', ': \n# grant_priv을 부여 받은 사용자 조회\n+-----------+--------------+------------+\n| Host      | User         | Grant_priv |\n+-----------+--------------+------------+\n| localhost | root         | Y          |\n| localhost | vcap         | Y          |\n| %         | root         | Y          |\n| %         | applifecycle | Y          |\n+-----------+--------------+------------+\n\n[Check] : \n*grant_priv 권한이 적절한 사용자에게 부여되어 있으면 양호\n']
['[Comment] : \n# mysql.user 테이블 접근이 가능한 사용자 조회\n+--------------------------------------+--------------+-------------+\n| Host                                 | User         | Select_priv |\n+--------------------------------------+--------------+-------------+\n| localhost                            | mariadb.sys  | N           |\n| localhost                            | root         | Y           |\n| localhost                            | vcap         | Y           |\n| localhost                            |              | N           |\n| b5484ee5-4a21-4a6f-8e45-f11376a2d60a |              | N           |\n| %                                    | root         | Y           |\n| localhost                            | applifecycle | N           |\n| %                                    | applifecycle | Y           |\n+--------------------------------------+--------------+-------------+\n\n[Check]\n*DB사용자 계정 정보 테이블의 접근 권한이 적절한 사용자에게 부여되어 있으면 양호\n\n']
[' DY-04', ' Info', ': \n# mysql.user 테이블 접근이 가능한 사용자 조회\n+--------------------------------------+--------------+-------------+\n| Host                                 | User         | Select_priv |\n+--------------------------------------+--------------+-------------+\n| localhost                            | mariadb.sys  | N           |\n| localhost                            | root         | Y           |\n| localhost                            | vcap         | Y           |\n| localhost                            |              | N           |\n| b5484ee5-4a21-4a6f-8e45-f11376a2d60a |              | N           |\n| %                                    | root         | Y           |\n| localhost                            | applifecycle | N           |\n| %                                    | applifecycle | Y           |\n+--------------------------------------+--------------+-------------+\n\n[Check]\n*DB사용자 계정 정보 테이블의 접근 권한이 적절한 사용자에게 부여되어 있으면 양호\n']
['[Comment] : \n# my.cnf 설정 확인\nuser            = vcap\n\n# My-SQL 프로세스 확인\nroot      4770     1  0 11:58 ?        00:00:00 /bin/sh /var/vcap/packages/mariadb/bin/mysqld_safe --defaults-file=/var/vcap/jobs/mariadb/config/mariadb.cnf --user=vcap\nvcap      4975  4770  0 11:59 ?        00:00:03 /var/vcap/packages/mariadb/bin/mariadbd --defaults-file=/var/vcap/jobs/mariadb/config/mariadb.cnf --basedir=/var/vcap/packages/mariadb --datadir=/var/vcap/store/mariadb --plugin-dir=/var/vcap/packages/mariadb/lib/plugin --user=vcap --log-error=/var/vcap/sys/log/mariadb/mariadb-error.log --pid-file=/var/vcap/sys/run/mariadb/mariadb.pid --socket=/var/vcap/sys/run/mariadb/mysql.sock --port=31306\nroot      6187  5635  0 17:20 pts/0    00:00:00 sh ./mysql_5.7_v4.1(PaaS-TA).bin\n\n']
[' DY-05', ' Info', ': \n# my.cnf 설정 확인\nuser            = vcap\n\n# My-SQL 프로세스 확인\nroot      4770     1  0 11:58 ?        00:00:00 /bin/sh /var/vcap/packages/mariadb/bin/mysqld_safe --defaults-file=/var/vcap/jobs/mariadb/config/mariadb.cnf --user=vcap\nvcap      4975  4770  0 11:59 ?        00:00:03 /var/vcap/packages/mariadb/bin/mariadbd --defaults-file=/var/vcap/jobs/mariadb/config/mariadb.cnf --basedir=/var/vcap/packages/mariadb --datadir=/var/vcap/store/mariadb --plugin-dir=/var/vcap/packages/mariadb/lib/plugin --user=vcap --log-error=/var/vcap/sys/log/mariadb/mariadb-error.log --pid-file=/var/vcap/sys/run/mariadb/mariadb.pid --socket=/var/vcap/sys/run/mariadb/mysql.sock --port=31306\nroot      6187  5635  0 17:20 pts/0    00:00:00 sh ./mysql_5.7_v4.1(PaaS-TA).bin\n']
['[Comment] : \n-rw-r----- 1 root vcap 2078 Nov 30 11:32 /var/vcap/jobs/mariadb/config/mariadb.cnf\n\n[Check]\n*initialization 파일 접근 권한이 640(rw-r-----) 이하이면 양호\n\n']
[' DY-06', ' Good', ': \n-rw-r----- 1 root vcap 2078 Nov 30 11:32 /var/vcap/jobs/mariadb/config/mariadb.cnf\n\n[Check]\n*initialization 파일 접근 권한이 640(rw-r-----) 이하이면 양호\n']
[]
[]
[]
[]
Traceback (most recent call last):
  File "C:\Users\Revit007\PycharmProjects\pythonProject\main.py", line 43, in <module>
    result_df["진단항목"] = ['불필요한 계정 제거','취약한 패스워드 사용제한','타사용자에 권한 부여 옵션 사용제한','DB 사용자 계정 정보 테이블 접근','root 권한으로 서버 구동 제한','환경설정 파일 접근 권한','안전한 암호화 알고리즘 사용','로그 활성화','최신패치 적용']
  File "C:\Users\Revit007\PycharmProjects\pythonProject\venv\lib\site-packages\pandas\core\frame.py", line 3978, in __setitem__
    self._set_item(key, value)
  File "C:\Users\Revit007\PycharmProjects\pythonProject\venv\lib\site-packages\pandas\core\frame.py", line 4172, in _set_item
    value = self._sanitize_column(value)
  File "C:\Users\Revit007\PycharmProjects\pythonProject\venv\lib\site-packages\pandas\core\frame.py", line 4912, in _sanitize_column
    com.require_length_match(value, self.index)
  File "C:\Users\Revit007\PycharmProjects\pythonProject\venv\lib\site-packages\pandas\core\common.py", line 561, in require_length_match
    raise ValueError(
ValueError: Length of values (9) does not match length of index (6)
```

# Tomcat
## python code
```
# -*- coding: utf-8 -*-
import pandas as pd
import re
import glob

for filename in glob.glob('Tomcat*.txt'):
    f = open(filename, "rt", encoding="UTF-8")
    txt_list = f.readlines()
    f.close()
    data = "".join(txt_list)

def get_preprocess_li(data):
    re_id = re.compile(r"\[ID\] : [\S]*\n", re.DOTALL)
    re_result = re.compile(r"\[Result\] : [\S]*\n", re.DOTALL)
    re_comment = re.compile(r"\[Comment\] : .*\n", re.DOTALL)

    split_list = data.split("======================================================================================")
    result_list = []

    for sp in split_list:
        tmp_list = []
        id_txt = re_id.findall(sp)
        result_txt = re_result.findall(sp)
        comment_txt = re_comment.findall(sp)
        if (id_txt and result_txt and comment_txt):
            tmp_list.append(id_txt[0][6:-1])
            #print(tmp_list)
            tmp_list.append(result_txt[0][10:-1])
            #print(tmp_list)
            tmp_list.append(comment_txt[0][10:-1])
            print(tmp_list)
            result_list.append(tmp_list)
            #print(result_list)
    return result_list


result_list = get_preprocess_li(data)
result_df = pd.DataFrame(result_list, columns=["ID", "취약", "진단|가이드 PAGE"])
# result_df.replace(to_replace='Good', value='N', regex=True, inplace=True)
# result_df.replace({'Good':'N', 'Info':'E', 'Weak':'Y'}, inplace=True)
result_df.replace(['Good', 'Info', 'Weak'], ['N', 'E', 'Y'], inplace=True)

# 고정값
result_df["자산명"] = " "
result_df["호스트명"] = " "
result_df["진단항목"] = ['Default 관리자 계정명 변경', '취약한 패스워드 사용제한', '	패스워드 파일 권한 관리', '홈디렉터리 쓰기 권한 관리', '환경설정 파일 권한 관리', '디렉터리 리스팅 설정 제한', '에러 메시지 관리', '로그 파일 주기적 백업', '최신 패치 적용']
result_df[" "] = [284, 286, 287, 289, 290, 292, 293, 294, 295]
result_df["조치방법"] = " "
result_df["정상 동작 확인 방법"] = " "
result_df["조치 확인"] = " "
result_df["비고"] = " "
result_df["OS(SW)/버전"] = " "


# 고정값 넣고 컬럼 순서 재정렬
result_df = result_df[["취약", "자산명", "ID", "호스트명", "OS(SW)/버전", "진단항목", "진단|가이드 PAGE", " ", "조치방법", "정상 동작 확인 방법", "조치 확인", "비고"]]

# 단일 시트
result_df.to_excel("result.xlsx", sheet_name="Sheet1")
# 다중시트
with pd.ExcelWriter("result_multi.xlsx") as writer:
    result_df.to_excel(writer, sheet_name="Sheet1")
    result_df.to_excel(writer, sheet_name="Sheet2")
```

## error
```
[' WS-01', ' Info', ': \ntomcat-users.xml 파일 설정 확인\n<?xml version="1.0" encoding="UTF-8"?>\n<!--\n  Licensed to the Apache Software Foundation (ASF) under one or more\n  contributor license agreements.  See the NOTICE file distributed with\n  this work for additional information regarding copyright ownership.\n  The ASF licenses this file to You under the Apache License, Version 2.0\n  (the "License"); you may not use this file except in compliance with\n  the License.  You may obtain a copy of the License at\n\n      http://www.apache.org/licenses/LICENSE-2.0\n\n  Unless required by applicable law or agreed to in writing, software\n  distributed under the License is distributed on an "AS IS" BASIS,\n  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  See the License for the specific language governing permissions and\n  limitations under the License.\n-->\n<tomcat-users xmlns="http://tomcat.apache.org/xml"\n              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n              xsi:schemaLocation="http://tomcat.apache.org/xml tomcat-users.xsd"\n              version="1.0">\n<!--\n  By default, no user is included in the "manager-gui" role required\n  to operate the "/manager/html" web application.  If you wish to use this app,\n  you must define such a user - the username and password are arbitrary.\n\n  Built-in Tomcat manager roles:\n    - manager-gui    - allows access to the HTML GUI and the status pages\n    - manager-script - allows access to the HTTP API and the status pages\n    - manager-jmx    - allows access to the JMX proxy and the status pages\n    - manager-status - allows access to the status pages only\n\n  The users below are wrapped in a comment and are therefore ignored. If you\n  wish to configure one or more of these users for use with the manager web\n  application, do not forget to remove the <!.. ..> that surrounds them. You\n  will also need to set the passwords to something appropriate.\n-->\n<!--\n  <user username="admin" password="<must-be-changed>" roles="manager-gui"/>\n  <user username="robot" password="<must-be-changed>" roles="manager-script"/>\n-->\n<!--\n  The sample user and role entries below are intended for use with the\n  examples web application. They are wrapped in a comment and thus are ignored\n  when reading this file. If you wish to configure these users for use with the\n  examples web application, do not forget to remove the <!.. ..> that surrounds\n  them. You will also need to set the passwords to something appropriate.\n-->\n<!--\n  <role rolename="tomcat"/>\n  <role rolename="role1"/>\n  <user username="tomcat" password="<must-be-changed>" roles="tomcat"/>\n  <user username="both" password="<must-be-changed>" roles="tomcat,role1"/>\n  <user username="role1" password="<must-be-changed>" roles="role1"/>\n-->\n</tomcat-users>\n\n[Check] 계정명이 Default 계정명으로 설정되어 있지 않으면 양호']
[' WS-02', ' Info', ': \ntomcat-users.xml 파일 설정 확인\n<?xml version="1.0" encoding="UTF-8"?>\n<!--\n  Licensed to the Apache Software Foundation (ASF) under one or more\n  contributor license agreements.  See the NOTICE file distributed with\n  this work for additional information regarding copyright ownership.\n  The ASF licenses this file to You under the Apache License, Version 2.0\n  (the "License"); you may not use this file except in compliance with\n  the License.  You may obtain a copy of the License at\n\n      http://www.apache.org/licenses/LICENSE-2.0\n\n  Unless required by applicable law or agreed to in writing, software\n  distributed under the License is distributed on an "AS IS" BASIS,\n  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  See the License for the specific language governing permissions and\n  limitations under the License.\n-->\n<tomcat-users xmlns="http://tomcat.apache.org/xml"\n              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n              xsi:schemaLocation="http://tomcat.apache.org/xml tomcat-users.xsd"\n              version="1.0">\n<!--\n  By default, no user is included in the "manager-gui" role required\n  to operate the "/manager/html" web application.  If you wish to use this app,\n  you must define such a user - the username and password are arbitrary.\n\n  Built-in Tomcat manager roles:\n    - manager-gui    - allows access to the HTML GUI and the status pages\n    - manager-script - allows access to the HTTP API and the status pages\n    - manager-jmx    - allows access to the JMX proxy and the status pages\n    - manager-status - allows access to the status pages only\n\n  The users below are wrapped in a comment and are therefore ignored. If you\n  wish to configure one or more of these users for use with the manager web\n  application, do not forget to remove the <!.. ..> that surrounds them. You\n  will also need to set the passwords to something appropriate.\n-->\n<!--\n  <user username="admin" password="<must-be-changed>" roles="manager-gui"/>\n  <user username="robot" password="<must-be-changed>" roles="manager-script"/>\n-->\n<!--\n  The sample user and role entries below are intended for use with the\n  examples web application. They are wrapped in a comment and thus are ignored\n  when reading this file. If you wish to configure these users for use with the\n  examples web application, do not forget to remove the <!.. ..> that surrounds\n  them. You will also need to set the passwords to something appropriate.\n-->\n<!--\n  <role rolename="tomcat"/>\n  <role rolename="role1"/>\n  <user username="tomcat" password="<must-be-changed>" roles="tomcat"/>\n  <user username="both" password="<must-be-changed>" roles="tomcat,role1"/>\n  <user username="role1" password="<must-be-changed>" roles="role1"/>\n-->\n</tomcat-users>\n\n[Check] 관리자 패스워드가 암호화 되어 있거나, 유추하기 쉬운 패스워드로 설정되어 있지 않으면 양호']
[' WS-03', ' Good', ': \ntomcat-users.xml 파일 권한 확인\n-rw------- 1 vcap vcap 2756 Jul 14 21:28 /var/vcap/data/uaa/tomcat/conf/tomcat-users.xml\n\n/var/vcap/data/uaa/tomcat/conf/tomcat-users.xml 파일의 퍼미션이 600이하이므로 양호함\n\n[Check] 패스워드 파일에 권한이 600(rw-------) 이하로 설정되어 있으면 양호']
[' WS-04', ' Info', ': \n가. Default Document Root 권한 확인(소스 설치)\ndrwx------ 6 vcap vcap 4096 Oct 13 09:44 /var/vcap/data/uaa/tomcat/webapps/ROOT\n\n나. 관리서버 홈 디렉터리 권한 확인(소스 설치)\nls: cannot access \'/var/vcap/data/uaa/tomcat/webapps/manager\': No such file or directory\n\n다. 웹 소스 홈 디렉터리 권한 확인\ndrwx------ 4 vcap vcap 4096 Oct 13 09:45 /var/vcap/data/uaa/tomcat/webapps\n\n[참고]\n※ Default Document Root를 사용하지 않을 경우 server.xml 파일 참조\n\nserver.xml 파일 설정 확인\n            appBase="webapps"\n\n[Check] 홈 디렉토리 또는 웹 서버, 관리 서버 디렉터리 권한이 755(drwxr-xr-x)로 설정되어 있으면 양호']
[' WS-05', ' Info', ': \n가. 환경설정 파일 권한 확인\ntotal 236\ndrwx------ 3 vcap vcap   4096 Oct 13 09:45 .\ndrwxr-xr-x 9 vcap vcap   4096 Oct 13 09:40 ..\ndrwxr-x--- 3 vcap vcap   4096 Oct 13 09:44 Catalina\n-rw------- 1 vcap vcap  12953 Jul 14 21:28 catalina.policy\n-rw------- 1 vcap vcap   7308 Jul 14 21:28 catalina.properties\n-rw------- 1 vcap vcap   1076 Oct 13 09:17 context.xml\n-rw------- 1 vcap vcap   1149 Jul 14 21:28 jaspic-providers.xml\n-rw------- 1 vcap vcap   2313 Jul 14 21:28 jaspic-providers.xsd\n-rw------- 1 vcap vcap   2535 Oct 13 09:17 logging.properties\n-rw------- 1 vcap vcap   2973 Oct 13 09:17 server.xml\n-rw------- 1 vcap vcap   2756 Jul 14 21:28 tomcat-users.xml\n-rw------- 1 vcap vcap   2558 Jul 14 21:28 tomcat-users.xsd\n-rw------- 1 vcap vcap 173045 Oct 13 09:45 web.xml\n\n나. Default 소스파일 권한 확인(소스 설치)\ntotal 24\ndrwx------ 6 vcap vcap 4096 Oct 13 09:44 .\ndrwx------ 4 vcap vcap 4096 Oct 13 09:45 ..\ndrwx------ 2 vcap vcap 4096 Oct 13 09:44 META-INF\ndrwx------ 5 vcap vcap 4096 Oct 13 09:44 WEB-INF\ndrwx------ 6 vcap vcap 4096 Oct 13 09:44 resources\ndrwx------ 4 vcap vcap 4096 Oct 13 09:44 vendor\n\n다. 웹 소스파일 권한 확인\ntotal 83784\ndrwx------ 4 vcap vcap     4096 Oct 13 09:45 .\ndrwxr-xr-x 9 vcap vcap     4096 Oct 13 09:40 ..\ndrwx------ 6 vcap vcap     4096 Oct 13 09:44 ROOT\n-rwx------ 1 vcap vcap 66855501 Aug 23 01:30 ROOT.war\ndrwx------ 5 vcap vcap     4096 Oct 13 09:45 statsd\n-rwx------ 1 vcap vcap 18916490 Aug 23 01:30 statsd.war\n\n[참고]\n※ Default Document Root를 사용하지 않을 경우 server.xml 파일 참조\n\n# Tomcat 설치 디렉터리\n/var/vcap/data/uaa/tomcat\n\n# Tomcat 설정파일 디렉터리 경로\n/var/vcap/data/uaa/tomcat/conf\n\n\nserver.xml 파일 설정 확인\n            appBase="webapps"\n\n[Check] WAS 전용계정 소유이고 소스파일 퍼미션 644, 설정파일 퍼미션 600으로 설정되어 있으면 양호']
[' WS-06', ' Weak', ': \nweb.xml 파일 설정 확인\n--\n--\n--\n--\n--\n            <param-name>listings</param-name>\n            <param-value>false</param-value>\n--\n[Check] 디렉토리 리스팅이 설정되어 있지 않으면 양호\n\n[취약] 디렉토리 리스팅이 설정되어 있으므로 취약함\n']
[' WS-08', ' Info', ': \n[인터뷰]\n\n1. 백업 정책을 바탕으로 주기적인 백업 절차를 수립여부 확인\n2. 유지보수 및 Upgrade 작업 시에는 전체 Full 백업 절차를 수립하고 있는지 확인\n3. 주기적인 백업정책 설정을 하고, 백업내용의 복사본이 안전한 off-site에 보관하고 있는지 확인\n\n[참고]\n로그 파일 확인\n로그 파일 확인(소스설치 시)\ntotal 8\ndrwxr-x--- 2 vcap vcap 4096 Jul 14 21:28 .\ndrwxr-xr-x 9 vcap vcap 4096 Oct 13 09:40 ..\n\nTomcat dpkg가 설치되어 있지 않습니다.']
[' WS-09', ' Info', ': \n가. Tomcat 버전 확인(패키지의 경우)\nTomcat dpkg 버전이 설치 되어 있지 않습니다.\n\n나. version.sh 파일을 통한 버전 확인(소스설치 일 경우)\nNeither the JAVA_HOME nor the JRE_HOME environment variable is defined\nAt least one of these environment variable is needed to run this program\n\n다. jar 파일을 통한 버전 확인\n./tomcat_v4.1.bin: 441: eval: java: not found\n[Check] 최신 패치를 적용 하였으면 양호']
Traceback (most recent call last):
  File "C:\Users\Revit007\PycharmProjects\pythonProject\tomcat.py", line 46, in <module>
    result_df["진단항목"] = ['Default 관리자 계정명 변경', '취약한 패스워드 사용제한', '	패스워드 파일 권한 관리', '홈디렉터리 쓰기 권한 관리', '환경설정 파일 권한 관리', '디렉터리 리스팅 설정 제한', '에러 메시지 관리', '로그 파일 주기적 백업', '최신 패치 적용']
  File "C:\Users\Revit007\PycharmProjects\pythonProject\venv\lib\site-packages\pandas\core\frame.py", line 3978, in __setitem__
    self._set_item(key, value)
  File "C:\Users\Revit007\PycharmProjects\pythonProject\venv\lib\site-packages\pandas\core\frame.py", line 4172, in _set_item
    value = self._sanitize_column(value)
  File "C:\Users\Revit007\PycharmProjects\pythonProject\venv\lib\site-packages\pandas\core\frame.py", line 4912, in _sanitize_column
    com.require_length_match(value, self.index)
  File "C:\Users\Revit007\PycharmProjects\pythonProject\venv\lib\site-packages\pandas\core\common.py", line 561, in require_length_match
    raise ValueError(
ValueError: Length of values (9) does not match length of index (8)
```
- WS-07 데이터가 안나옴
- : 형식으로 나오는 것 확인 및 수정 필요
- ValueError: Length of values (7) does not match length of index (8) 에러 확인 필요 

# bosh_txt_xlsx.py
```
#!/usr/bin/python3
# -*- coding: utf-8 -*-
import pandas as pd
import re
import glob

for filename in glob.glob('test/bosh/Linux*[!A-Z].txt'):
    f = open(filename, "rt", encoding="UTF-8")
    txt_list = f.readlines()
    f.close()
    data = "".join(txt_list)

def get_preprocess_li(data):
    re_id = re.compile(r"\[ID\]: [\S]*\n", re.DOTALL)
    re_result = re.compile(r"\[Result\]: [\S]*\n", re.DOTALL)
    re_comment = re.compile(r"\[Comment\]: .*\n", re.DOTALL)

    split_list = data.split("======================================================================================")
    result_list = []
    os_version = []

    for sp in split_list:
        tmp_list = []
        id_txt = re_id.findall(sp)
        result_txt = re_result.findall(sp)
        comment_txt = re_comment.findall(sp)
        if (id_txt and result_txt and comment_txt):
            tmp_list.append(id_txt[0][6:-1])
            tmp_list.append(result_txt[0][10:-1])
            tmp_list.append(comment_txt[0][10:-1])
            for line in tmp_list:
                if 'DISTRIB_ID' in line:
                    os_version.append(line[153:159])
                    os_version.append(line[176:181])
                    lst_str = str(os_version)[1:-1]
                    tmp_list.append(lst_str)
            result_list.append(tmp_list)
    return result_list


result_list = get_preprocess_li(data)
result_df_linux = pd.DataFrame(result_list, columns=["ID", "취약", "진단|가이드 PAGE", "OS(SW)/버전"])
# result_df.replace(to_replace='Good', value='N', regex=True, inplace=True)
# result_df.replace({'Good':'N', 'Info':'E', 'Weak':'Y'}, inplace=True)
result_df_linux.replace(['Good', 'Info', 'Weak'], ['N', 'E', 'Y'], inplace=True)

# 고정값
result_df_linux["자산명"] = "bosh"
result_df_linux["호스트명"] = "bosh"
result_df_linux["진단항목"] = ['root 계정 원격 접속 제한','패스워드 복잡성 설정','계정 잠금 임계값 설정','패스워드 최대 사용 기간 설정','패스워드 파일 보호','root 홈, 패스 디렉터리 권한 및 패스 설정','파일 및 디렉터리 소유자 설정','	/etc/passwd 파일 소유자 및 권한 설정','	/etc/shadow 파일 소유자 및 권한 설정','/etc/hosts 파일 소유자 및 권한 설정',' /etc/(x)inetd.conf 파일 소유자 및 권한 설정','/etc/syslog.conf 파일 소유자 및 권한 설정','	/etc/services 파일 소유자 및 권한 설정','SUID, SGID, Sticky bit 설정 파일 점검','사용자, 시스템 시작파일 및 환경파일 소유자 및 권한 설정','world writable 파일 점검','$HOME/.rhosts, hosts.equiv 사용 금지','접속 IP 및 포트 제한','cron 파일 소유자 및 권한 설정','Finger 서비스 비활성화','Anonymous FTP 비활성화','r 계열 서비스 비활성화','DoS 공격에 취약한 서비스 비활성화','NFS 서비스 비활성화','NFS 접근통제','automountd 제거','RPC 서비스 확인','NIS, NIS+ 점검','tftp, talk 서비스 비활성화','Sendmail 버전 점검','	스팸 메일 릴레이 제한','일반사용자의 Sendmail 실행 방지','DNS 보안 버전 패치','DNS ZoneTransfer 설정','최신 보안패치 및 벤더 권고사항 적용','로그의 정기적 검토 및 보고']
result_df_linux[" "] = [87, 89, 91, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 108, 110, 111, 112, 113, 114, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128]
result_df_linux["조치방법"] = " "
result_df_linux["정상 동작 확인 방법"] = " "
result_df_linux["조치 확인"] = " "
result_df_linux["비고"] = " "


# 고정값 넣고 컬럼 순서 재정렬
result_df_linux = result_df_linux[["취약", "자산명", "ID", "호스트명", "OS(SW)/버전", "진단항목", "진단|가이드 PAGE", " ", "조치방법", "정상 동작 확인 방법", "조치 확인", "비고"]]

#########################################################################

for filename in glob.glob('test/bosh/Tomcat*.txt'):
    f = open(filename, "rt", encoding="UTF-8")
    txt_list = f.readlines()
    f.close()
    data = "".join(txt_list)

def get_preprocess_li(data):
    re_id = re.compile(r"\[ID\] : [\S]*\n", re.DOTALL)
    re_result = re.compile(r"\[Result\] : [\S]*\n", re.DOTALL)
    re_comment = re.compile(r"\[Comment\] : .*\n", re.DOTALL)

    split_list = data.split("======================================================================================")
    result_list = []

    for sp in split_list:
        tmp_list = []
        id_txt = re_id.findall(sp)
        result_txt = re_result.findall(sp)
        comment_txt = re_comment.findall(sp)
        if (id_txt and result_txt and comment_txt):
            tmp_list.append(id_txt[0][6:-1])
            tmp_list.append(result_txt[0][10:-1])
            tmp_list.append(comment_txt[0][10:-1])
            result_list.append(tmp_list)
    return result_list

result_list = get_preprocess_li(data)
result_df_tomcat = pd.DataFrame(result_list, columns=["ID", "취약", "진단|가이드 PAGE"])
result_df_tomcat.replace([' Good', ' Info', ' Weak'], ['N', 'E', 'Y'], inplace=True)

# 고정값
result_df_tomcat["자산명"] = "bosh"
result_df_tomcat["호스트명"] = "bosh"
result_df_tomcat["진단항목"] = ['Default 관리자 계정명 변경', '취약한 패스워드 사용제한', '	패스워드 파일 권한 관리', '홈디렉터리 쓰기 권한 관리', '환경설정 파일 권한 관리', '디렉터리 리스팅 설정 제한', '로그 파일 주기적 백업', '최신 패치 적용']
result_df_tomcat[" "] = [284, 286, 287, 289, 290, 292, 294, 295]
result_df_tomcat["조치방법"] = " "
result_df_tomcat["정상 동작 확인 방법"] = " "
result_df_tomcat["조치 확인"] = " "
result_df_tomcat["비고"] = " "
result_df_tomcat["OS(SW)/버전"] = "tomcat"


# 고정값 넣고 컬럼 순서 재정렬
result_df_tomcat = result_df_tomcat[["취약", "자산명", "ID", "호스트명", "OS(SW)/버전", "진단항목", "진단|가이드 PAGE", " ", "조치방법", "정상 동작 확인 방법", "조치 확인", "비고"]]

#########################################################################

for filename in glob.glob('test/bosh/LUNA_Nginx*.txt'):
    f = open(filename, "rt", encoding="UTF-8")
    txt_list = f.readlines()
    f.close()
    data = "".join(txt_list)

def get_preprocess_li(data):
    re_id = re.compile(r"\[ID\]: [\S]*\n", re.DOTALL)
    re_result = re.compile(r"\[Result\]: [\S]*\n", re.DOTALL)
    re_comment = re.compile(r"\[Comment\]:.*\n", re.DOTALL)

    split_list = data.split("======================================================================================")
    result_list = []

    for sp in split_list:
        tmp_list = []
        id_txt = re_id.findall(sp)
        result_txt = re_result.findall(sp)
        comment_txt = re_comment.findall(sp)
        if (id_txt and result_txt and comment_txt):
            tmp_list.append(id_txt[0][6:-1])
            tmp_list.append(result_txt[0][10:-1])
            tmp_list.append(comment_txt[0][10:-1])
            result_list.append(tmp_list)
    return result_list

result_list = get_preprocess_li(data)
result_df_nginx = pd.DataFrame(result_list, columns=["ID", "취약", "진단|가이드 PAGE"])
result_df_nginx.replace(['Good', 'Info', 'Weak'], ['N', 'E', 'Y'], inplace=True)

# 고정값
result_df_nginx["자산명"] = "bosh"
result_df_nginx["호스트명"] = "bosh"
result_df_nginx["OS(SW)/버전"] = "nginx"
result_df_nginx["진단항목"] = ['웹 서비스 영역의 분리','불필요한 파일 제거','링크 사용금지','파일 업로드 및 다운로드 제한','디렉터리 리스팅 제거','웹 프로세스 권한 제한','안정화 버전 및 패치 적용']
result_df_nginx[" "] = [327,328,329,330,331,332,333]
result_df_nginx["조치방법"] = " "
result_df_nginx["정상 동작 확인 방법"] = " "
result_df_nginx["조치 확인"] = " "
result_df_nginx["비고"] = " "



# 고정값 넣고 컬럼 순서 재정렬
result_df_nginx = result_df_nginx[["취약", "자산명", "ID", "호스트명", "OS(SW)/버전", "진단항목", "진단|가이드 PAGE", " ", "조치방법", "정상 동작 확인 방법", "조치 확인", "비고"]]

#########################################################################

for filename in glob.glob('test/bosh/PostgreSQL*.txt'):
    f = open(filename, "rt", encoding="UTF-8")
    txt_list = f.readlines()
    f.close()
    data = "".join(txt_list)

def get_preprocess_li(data):
    re_id = re.compile(r"\[ID\]: [\S]*\n", re.DOTALL)
    re_result = re.compile(r"\[Result\]: [\S]*\n", re.DOTALL)
    re_comment = re.compile(r"\[Comment\]:.*\n", re.DOTALL)

    split_list = data.split("======================================================================================")
    result_list = []
    for sp in split_list:
        tmp_list = []
        id_txt = re_id.findall(sp)
        result_txt = re_result.findall(sp)
        comment_txt = re_comment.findall(sp)
        if (id_txt and result_txt and comment_txt):
            tmp_list.append(id_txt[0][6:-1])
            tmp_list.append(result_txt[0][10:-1])
            tmp_list.append(comment_txt[0][10:-1])
            result_list.append(tmp_list)
    return result_list

result_list = get_preprocess_li(data)
result_df_postgresql = pd.DataFrame(result_list, columns=["ID", "취약", "진단|가이드 PAGE"])
result_df_postgresql.replace(['Good', 'Info', 'Weak'], ['N', 'E', 'Y'], inplace=True)

# 고정값
result_df_postgresql["자산명"] = "bosh"
result_df_postgresql["호스트명"] = "bosh"
result_df_postgresql["OS(SW)/버전"] = "postgresql"
result_df_postgresql["진단항목"] = ['불필요한 계정 제거','취약한 패스워드 사용제한','불필요한 권한 제거','public schema 사용 제한','IP 접근 제한 설정','안전한 인증 방식 설정','안전한 암호화 알고리즘 사용','데이터 디렉토리 권한 설정','환경 설정파일 권한 설정','로그 활성화','최신 패치 적용']
result_df_postgresql[" "] = [262,263,264,265,266,267,269,270,271,272,273]
result_df_postgresql["조치방법"] = " "
result_df_postgresql["정상 동작 확인 방법"] = " "
result_df_postgresql["조치 확인"] = " "
result_df_postgresql["비고"] = " "



# 고정값 넣고 컬럼 순서 재정렬
result_df_postgresql = result_df_postgresql[["취약", "자산명", "ID", "호스트명", "OS(SW)/버전", "진단항목", "진단|가이드 PAGE", " ", "조치방법", "정상 동작 확인 방법", "조치 확인", "비고"]]


#########################################################################

for filename in glob.glob('test/bosh/LUNA_UAA*.txt'):
    f = open(filename, "rt", encoding="UTF-8")
    txt_list = f.readlines()
    f.close()
    data = "".join(txt_list)

def get_preprocess_li(data):
    re_id = re.compile(r"\[ID\]: [\S]*\n", re.DOTALL)
    re_result = re.compile(r"\[Result\]: [\S]*\n", re.DOTALL)
    re_comment = re.compile(r"\[Comment\]:.*\n", re.DOTALL)

    split_list = data.split("======================================================================================")
    result_list = []
    for sp in split_list:
        tmp_list = []
        id_txt = re_id.findall(sp)
        result_txt = re_result.findall(sp)
        comment_txt = re_comment.findall(sp)
        if (id_txt and result_txt and comment_txt):
            tmp_list.append(id_txt[0][6:-1])
            tmp_list.append(result_txt[0][10:-1])
            tmp_list.append(comment_txt[0][10:-1])
            result_list.append(tmp_list)
    return result_list

result_list = get_preprocess_li(data)
result_df_uaa = pd.DataFrame(result_list, columns=["ID", "취약", "진단|가이드 PAGE"])
result_df_uaa.replace(['Good', 'Info', 'Weak'], ['N', 'E', 'Y'], inplace=True)

# 고정값
result_df_uaa["자산명"] = "bosh"
result_df_uaa["호스트명"] = "bosh"
result_df_uaa["OS(SW)/버전"] = "uaa"
result_df_uaa["진단항목"] = ['계정 잠금 임계값 설정','패스워드 복잡도 설정','세션 타임아웃 설정','https 사용 여부 확인','로그 설정','최신 패치 적용']
result_df_uaa[" "] = [3,4,6,7,8,9]
result_df_uaa["조치방법"] = " "
result_df_uaa["정상 동작 확인 방법"] = " "
result_df_uaa["조치 확인"] = " "
result_df_uaa["비고"] = " "

# 고정값 넣고 컬럼 순서 재정렬
result_df_uaa = result_df_uaa[["취약", "자산명", "ID", "호스트명", "OS(SW)/버전", "진단항목", "진단|가이드 PAGE", " ", "조치방법", "정상 동작 확인 방법", "조치 확인", "비고"]]

# 다중시트
with pd.ExcelWriter("bosh.xlsx") as writer:
    result_df_linux.to_excel(writer, sheet_name="CCE-linux")
    result_df_tomcat.to_excel(writer, sheet_name="CCE-tomcat")
    result_df_nginx.to_excel(writer, sheet_name="CCE-nginx")
    result_df_postgresql.to_excel(writer, sheet_name="CCE-postgresql")
    result_df_uaa.to_excel(writer, sheet_name="CCE-UAA")
```