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

## trouble shooting3
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



