# Object Detection on AKS  

Team members:  
* CHEUNG Ka Sing 20824804 kscheungaq@connect.ust.hk  
* WU Rinigong 20806826 rwuam@connect.ust.hk  
* ZHU Huanqi 20786002 hzhuay@connect.ust.hk  

Canvas Group:  
* 10

## Contributions
* CHEUNG Ka Sing:  
  Coordinator; Owner and manager of Kubernetes cluster; Designer of overall application architecture; Developer of image processing backend; Manager of deployment and usage of infrastructure (Apache Airflow, Open FaaS, Redis)
  
* WU Rinigong

  Team member; Collaborator of Kubernetes cluster; Presentation and report participator; Video editor; Manager of deployment and usage of infrastructure (PostgreSQL)

* ZHU Huanqi

  Developer of Vue frontend website, nginx docker image, backend program and corresponding docker image; Presentation and report participator;  Manager of deployment and usage of infrastructure (Frontend and part of Backend)

## Main tools used (other than Docker)
- kubectl (https://kubernetes.io/docs/tasks/tools/#kubectl)
- Helm (https://helm.sh/docs/intro/install/)
- Arkade (https://github.com/alexellis/arkade)

## Installation
### Redis
```
arkade install redis
```
### PostgreSQL
#### Add Helm Repo
```
helm repo add bitnami https://charts.bitnami.com/bitnami
```
#### Install
```
helm install pgsql bitnami/postgresql
```
#### Attach the persistent volume claim to the helm chart
```
helm install pgsql bitnami/postgresql --set persistence.existingClaim=postgresql-pv-claim --set volumePermissions.enabled=true
```

### Airflow
Airflow Helm Chart (User Community) https://github.com/airflow-helm/charts/tree/main/charts/airflow  
Note that `<image-tag>` is coded inside `airflow-helm-values.yaml`.
```
helm repo add airflow-stable https://airflow-helm.github.io/charts
helm repo update
kubectl create namespace airflow225
docker build -t <image-tag> ./airflow/
docker push <image-tag>
helm install airflow-cluster airflow-stable/airflow -n airflow225 --version "8.6.0" --values ./airflow/airflow-helm-values.yaml
```
### Open FaaS
```
arkade install openfaas
```

### Vue

Project setup

```
npm install
```

Compiles and hot-reloads for development

```
npm run serve
```

Compiles and minifies for production

```
npm run build
```

#### Nginx

Build the image and upload to docker hub

```
docker build -t <image-name>:<tag> .
docker tag <image-name>:<tag> <username>/<image-name>:<tag>
docker push <username>/<image-name>:<tag>
```

Deploy on k8s

```
kubectl apply -f backend.yaml
```

### Node.js Backend

Project setup

```
npm install
```

Build the image and upload to docker hub

```
docker build -t <image-name>:<tag> .
docker tag <image-name>:<tag> <username>/<image-name>:<tag>
docker push <username>/<image-name>:<tag>
```

Deploy on k8s

```
kubectl apply -f deploy.yaml
```

