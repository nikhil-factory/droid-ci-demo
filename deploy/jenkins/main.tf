resource "random_password" "jenkins_admin" {
  length  = 20
  special = false
}

# Stable public IP so the webhook / build URLs don't change on reboot.
resource "google_compute_address" "jenkins" {
  name   = "droid-ci-demo-jenkins-ip"
  region = var.region
}

# Jenkins UI + webhook receiver. Open to the internet so both your browser and
# GitHub webhooks can reach it. This is a throwaway demo VM in the dev project.
resource "google_compute_firewall" "jenkins_ui" {
  name    = "droid-ci-demo-jenkins-ui"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["8080"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["droid-ci-demo-jenkins"]
}

resource "google_compute_firewall" "jenkins_ssh" {
  name    = "droid-ci-demo-jenkins-ssh"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  # Your IP plus GCP IAP range (for gcloud compute ssh --tunnel-through-iap).
  source_ranges = [var.ssh_source_cidr, "35.235.240.0/20"]
  target_tags   = ["droid-ci-demo-jenkins"]
}

resource "google_compute_instance" "jenkins" {
  name         = "droid-ci-demo-jenkins"
  machine_type = var.machine_type
  zone         = var.zone
  tags         = ["droid-ci-demo-jenkins"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
      size  = 30
    }
  }

  network_interface {
    network = "default"
    access_config {
      nat_ip = google_compute_address.jenkins.address
    }
  }

  metadata = {
    startup-script = templatefile("${path.module}/startup.sh.tftpl", {
      admin_password = random_password.jenkins_admin.result
      public_ip      = google_compute_address.jenkins.address
      repo_owner     = var.repo_owner
      repo_name      = var.repo_name
    })
  }

  # Recreate the VM if the startup script changes.
  metadata_startup_script = null

  scheduling {
    automatic_restart = true
  }

  allow_stopping_for_update = true
}
