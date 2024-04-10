pipeline {
  agent any
  environment {
    IMAGE_REPO_NAME = "ug-algo-parrot"
    DOCKER_FILE = "Dockerfile_${env.ENV_NAME}"
    IMAGE_NAME = "parrot"
    IMAGE_VERSION = "build-${env.CI_BUILD_NUMBER}"
    BUILD_PATH = "."
  }

  stages {
    stage("设置变量") {
      steps {
        script {
          env.IMAGE_FULL_NAME = "${PROJECT_NAME.toLowerCase()}/${IMAGE_REPO_NAME}/${IMAGE_NAME}:${IMAGE_VERSION}"
          // 开发环境部署 web hook
          env.WEB_HOOK_SOURCE_DEV = "${IMAGE_NAME}-deploy-dev"  
          // 测试环境部署 web hook
          env.WEB_HOOK_SOURCE_TEST = "${IMAGE_NAME}-deploy-test" 
          // 正式环境部署 web hook
          env.WEB_HOOK_SOURCE_PRO = "${IMAGE_NAME}-deploy-pro"  
          sh "printenv"
          echo "设置变量完成: "
          echo "IMAGE_FULL_NAME=${IMAGE_FULL_NAME} "
          echo "WEB_HOOK_SOURCE_DEV=${WEB_HOOK_SOURCE_DEV}"
          echo "WEB_HOOK_SOURCE_TEST=${WEB_HOOK_SOURCE_TEST}"
          echo "WEB_HOOK_SOURCE_PRO=${WEB_HOOK_SOURCE_PRO}"
        }
      }
    }

    stage("检出Git") {
      steps {
        checkout([$class: "GitSCM", branches: [[name: env.GIT_BUILD_REF]], userRemoteConfigs: [[url: env.GIT_REPO_URL, credentialsId: env.CREDENTIALS_ID]]])
        echo "检出Git完成."
      }
    }
        
    stage('构建镜像并推送到 CODING Docker 制品库') {
      steps {
        script {
          docker.withRegistry(
            "${CCI_CURRENT_WEB_PROTOCOL}://${CCI_CURRENT_TEAM}-${CCI_DOCKER_REGISTRY_DOMAIN}",
            "${CODING_ARTIFACTS_CREDENTIALS_ID}"
          ) {
            docker.build("${IMAGE_FULL_NAME}", "-f ${DOCKER_FILE} .").push()
            sh "docker rmi ${IMAGE_FULL_NAME}"
          }
        }
      }
    }

    stage("部署到开发环境") {
       when {
        branch 'dev*'
      }
      steps {
        script {
          echo "部署开发环境中..."
          sh 'curl https://api-spinnaker-beta.devops.intlgame.com/webhooks/webhook/${WEB_HOOK_SOURCE_DEV} -X POST -H "content-type: application/json" -d \'{"parameters": {"image_version": "\'"${IMAGE_VERSION}"\'"}}\''
          echo "部署已经触发，可以在Spinnaker查看状态: https://api-spinnaker-beta.devops.intlgame.com"
        }
      }
    }

    stage("部署到测试环境") {
       when {
        branch 'master'
      }
      steps {
        script {
          echo "部署开发环境中..."
          sh 'curl https://api-spinnaker-beta.devops.intlgame.com/webhooks/webhook/${WEB_HOOK_SOURCE_DEV} -X POST -H "content-type: application/json" -d \'{"parameters": {"image_version": "\'"${IMAGE_VERSION}"\'"}}\''
          echo "部署已经触发，可以在Spinnaker查看状态: https://api-spinnaker-beta.devops.intlgame.com"
        }
      }
    }

    stage("部署到正式环境") {
      when {
        tag "*-production-release"
      }
      steps {
        script {
          echo "部署正式环境中..."
          sh 'curl https://api-spinnaker-beta.devops.intlgame.com/webhooks/webhook/${WEB_HOOK_SOURCE_PRO} -X POST -H "content-type: application/json" -d \'{"parameters": {"image_version": "\'"${IMAGE_VERSION}"\'"}}\''
          echo "部署已经触发，可以在Spinnaker查看状态: https://api-spinnaker-beta.devops.intlgame.com"
        }
      }
    }
  }
}