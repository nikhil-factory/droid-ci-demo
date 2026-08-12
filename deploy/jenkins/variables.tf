variable "project_id" {
  description = "GCP project to host the demo Jenkins VM"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-west2"
}

variable "zone" {
  description = "GCP zone"
  type        = string
  default     = "us-west2-a"
}

variable "machine_type" {
  description = "GCE machine type for Jenkins"
  type        = string
  default     = "e2-small"
}

variable "ssh_source_cidr" {
  description = "CIDR allowed to SSH to the VM (your public IP /32)"
  type        = string
}

variable "repo_owner" {
  description = "GitHub owner of the demo repo"
  type        = string
  default     = "nikhil-factory"
}

variable "repo_name" {
  description = "GitHub repo name of the demo repo"
  type        = string
  default     = "droid-ci-demo"
}
