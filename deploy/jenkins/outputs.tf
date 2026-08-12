output "jenkins_url" {
  description = "Jenkins base URL"
  value       = "http://${google_compute_address.jenkins.address}:8080/"
}

output "jenkins_public_ip" {
  value = google_compute_address.jenkins.address
}

output "webhook_url" {
  description = "Set this as a GitHub webhook (push + pull_request events)"
  value       = "http://${google_compute_address.jenkins.address}:8080/github-webhook/"
}

output "jenkins_admin_user" {
  value = "admin"
}

output "jenkins_admin_password" {
  description = "Generated admin password"
  value       = random_password.jenkins_admin.result
  sensitive   = true
}

output "ssh_command" {
  value = "gcloud compute ssh droid-ci-demo-jenkins --zone ${var.zone} --project ${var.project_id} --tunnel-through-iap"
}
