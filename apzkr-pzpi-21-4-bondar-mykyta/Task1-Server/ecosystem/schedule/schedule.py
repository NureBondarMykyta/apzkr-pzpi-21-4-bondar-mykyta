import contextlib
import subprocess
from datetime import datetime

from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
from django.core.management import call_command


def db_backup():
    with contextlib.suppress(Exception):
            try:
                now = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
                backup_file = f'backup/auto_backup_{now}.sql'
                pg_dump_path = '/opt/homebrew/opt/postgresql@16/bin/pg_dump'
                with open(backup_file, 'w') as f:
                    result = subprocess.run(
                        [pg_dump_path, 'ecosystem'],
                        stdout=f,
                        stderr=subprocess.PIPE,
                        check=True
                    )

                print("Backup created successfully! File: " + backup_file)

            except subprocess.CalledProcessError as e:
                print("Failed to create backup: " + e.stderr.decode())

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), "default")
    #scheduler.add_job(db_backup, 'interval', hours=3, jobstore="default", id="weekly_backup", replace_existing=True)
    scheduler.start()
    print('Start scheduler')

