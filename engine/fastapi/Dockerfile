FROM python:3.11-slim

WORKDIR /app

RUN pip install fastapi uvicorn[standard] python-chess

COPY . .

EXPOSE 4000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "4000"]