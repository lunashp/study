## test vm 배포 시 
### linux, mysql 다중 시트(py) release 업로드 후 배포
```
Task 804 | 08:50:20 | Error: - Failed to find variable '/micro-bosh/test/mariadb_azs' from config server: HTTP Code '404', Error: 'The request could not be completed because the credential does not exist or you do not have sufficient authorization.'
- Failed to find variable '/micro-bosh/test/mariadb_instances' from config server: HTTP Code '404', Error: 'The request could not be completed because the credential does not exist or you do not have sufficient authorization.'
- Failed to find variable '/micro-bosh/test/private_networks_name' from config server: HTTP Code '404', Error: 'The request could not be completed because the credential does not exist or you do not have sufficient authorization.'
- Failed to find variable '/micro-bosh/test/vm_type_default' from config server: HTTP Code '404', Error: 'The request could not be completed because the credential does not exist or you do not have sufficient authorization.'
- Failed to find variable '/micro-bosh/test/stemcell_os' from config server: HTTP Code '404', Error: 'The request could not be completed because the credential does not exist or you do not have sufficient authorization.'
- Failed to find variable '/micro-bosh/test/stemcell_version' from config server: HTTP Code '404', Error: 'The request could not be completed because the credential does not exist or you do not have sufficient authorization.'
```