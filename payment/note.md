# create culters in GCP in kubernetes menu

---

# install gcp cli

-https://cloud.google.com/sdk/docs/install#windows

## login

- gcloud login

## init projek

- gcloud init

## for init cluster in google cloud

- gcloud container clusters get-credentials ticketing-dev

# in docker destop kubernete switch to GCP kubernestes

## derectory gcp

- Users/p/AppData/Local/Google

## proble credentials to push image with skaffold

- gcloud auth application-default login
- https://cloud.google.com/sdk/gcloud/reference/auth/application-default/login#--disable-quota-project

---

# kubernetes

semua tentang kubernetes

## kubectl get namespace

- untuk mendapatkan namespace/env yang tersedia, default kita berjalan di namespace dafault

## get service by namespace

- kubectl get services -n "nama namespace"
- name locabalancer in list service ingress-nginx `ingress-nginx-controller`

### and url

- http://ingress-nginx-controller.svc.cluster.local

## create external service

## create eviroment variable global in kubernetes eviroment

- kubectl create secret generic jwt-secret --from-literal=JWT_KEY=abcd
- and modify in deplyment file and add to definision env in kubernetes env to application/image docker

## for enter to bash directory container

- kubectl exec -it `nama pods` sh

---

# skaffold

## prune image in deployment

- skaffold dev --no-prune=false --cache-artifacts=false
