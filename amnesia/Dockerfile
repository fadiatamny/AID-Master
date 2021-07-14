FROM python:3.7

RUN python --version
COPY ./requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip install -r requirements.txt

COPY . /app

# DEPLOY without GUNICORN
# CMD [ "python", "./main.py" ]
# IF deployment with GUNICORN
CMD [ "gunicorn", "-b", ":5000", "main:app" ]