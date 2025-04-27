resource "aws_vpc" "chesscloud_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "chesscloud-vpc"
  }
}

resource "aws_internet_gateway" "chesscloud_igw" {
  vpc_id = aws_vpc.chesscloud_vpc.id

  tags = {
    Name = "chesscloud-igw"
  }
}

resource "aws_subnet" "chesscloud_public_subnet" {
  vpc_id                  = aws_vpc.chesscloud_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-southeast-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "chesscloud-public-subnet"
  }
}

resource "aws_subnet" "chesscloud_public_subnet_2" {
  vpc_id                  = aws_vpc.chesscloud_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "ap-southeast-1b" # different AZ from the first
  map_public_ip_on_launch = true

  tags = {
    Name = "chesscloud-public-subnet-2"
  }
}


resource "aws_route_table" "chesscloud_public_rt" {
  vpc_id = aws_vpc.chesscloud_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.chesscloud_igw.id
  }

  tags = {
    Name = "chesscloud-public-rt"
  }
}

resource "aws_route_table_association" "chesscloud_public_rt_assoc" {
  subnet_id      = aws_subnet.chesscloud_public_subnet.id
  route_table_id = aws_route_table.chesscloud_public_rt.id
}

resource "aws_route_table_association" "chesscloud_public_rt_assoc_2" {
  subnet_id      = aws_subnet.chesscloud_public_subnet_2.id
  route_table_id = aws_route_table.chesscloud_public_rt.id
}
