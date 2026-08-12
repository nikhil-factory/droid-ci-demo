pipeline {
  agent any

  tools {
    // Configure a NodeJS installation named 'node20' under
    // Manage Jenkins > Tools (requires the NodeJS plugin).
    nodejs 'node20'
  }

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  stages {
    stage('Install') {
      steps {
        sh 'node --version'
        sh 'npm ci'
      }
    }

    stage('Type check') {
      steps {
        sh 'npm run typecheck'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
  }

  post {
    always {
      // Publish Jest results (JUnit format) so failures are visible in the UI.
      junit testResults: 'reports/junit.xml', allowEmptyResults: true
      archiveArtifacts artifacts: 'reports/junit.xml', allowEmptyArchive: true
    }
  }
}
