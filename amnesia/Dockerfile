FROM python:3.7

RUN python --version
COPY ./requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip install -r requirements.txt

COPY . /app

CMD [ "python", "./main.py" ]
# CMD [ "gunicorn", "-b", ":5000", "main:app" ]