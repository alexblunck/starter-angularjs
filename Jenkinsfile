pipeline {
  agent any
  
  stages {
    // Build
    stage('Build') {
      steps {
        sh 'npm i'
        sh 'npm run build'
      }
    }
    
    // Upload
    stage('Upload') {
      steps {
        echo 'Uploading...'
      }
    }
  }
}
