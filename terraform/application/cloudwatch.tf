resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name              = "/ecs/ChessCloudTask"
  retention_in_days = 7
}
