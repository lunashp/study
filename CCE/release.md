### ubuntu@ubuntu:~/workspace/cce-check/release/jobs/cce-common/templates/scripts$ vim cce-common.sh.erb
```
#!/bin/bash
  
set -e -x

echo "<%= spec.ip %>" | ./linux_v4.1.bin

echo "#######[CCE :: linux_v4.1.bin ::  END]####################"

sleep 2

./python_be.sh

sleep 60

./linux_xlsx.py
```


### ubuntu@ubuntu:~/workspace/cce-check/release/jobs/cce-common/templates/scripts$ vi ../../spec
```
---
name: cce-common

templates:
  post-deploy.sh.erb: bin/post-deploy
  scripts/cce-common.sh.erb: scripts/cce-common.sh
  scripts/linux_v4.1.bin: scripts/linux_v4.1.bin
  scripts/python_be.sh: scripts/python_be.sh
  scripts/linux_xlsx.py: scripts/linux_xlsx.py

packages: []

properties: {}

```