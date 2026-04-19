pipeline {
  agent any
  tools { nodejs 'NodeJS-18' }

  stages {

    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build - npm Install') {
      steps { bat 'npm install' }
    }

    stage('Static Analysis - ESLint') {
      steps { bat 'npm run lint' }
    }

    stage('Test - Jest') {
      steps { bat 'npm test' }
    }

    stage('Docker Build') {
      steps { bat 'docker build -t weather-dashboard .' }
    }

    stage('Deploy Notification') {
      steps { echo 'Pipeline complete! App deployed on Render.' }
    }
  }

  post {
    success { echo 'All stages passed! Build successful.' }
    failure { echo 'Pipeline failed. Check the stage logs above.' }
  }
}