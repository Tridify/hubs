pipeline {
    agent { label "fixed-linux" }
    stages {
        stage("Build") {
            environment {
                NODE_OPTIONS='--max-old-space-size=8192'
            }
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }
        stage("Deploy") {
            steps {
                script {
                    def path = "hubs/"
                    if(env.BRANCH_NAME != "prod") {
                        path += env.BRANCH_NAME
                    }
                    sh "aws s3 cp ./dist/ 's3://view.tridify.com/${path}'  --recursive  --exclude 'index.html' --include '*'"
                    sh "aws s3 cp ./dist/index.html 's3://view.tridify.com/${path}/index.html' --cache-control no-cache"
                    sh "aws cloudfront create-invalidation --distribution-id E53CGHVMV9SPB --paths '/*'"
                }
            }
        }
    }
    post {
        failure {
            slackSend (color: '#FF0000', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        }
    }
}
