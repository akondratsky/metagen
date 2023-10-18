pipeline {
  agent any

  stages {

    stage('info') {
      steps {
        echo "Pipeline Configuration"
      }
    }
  }
}
