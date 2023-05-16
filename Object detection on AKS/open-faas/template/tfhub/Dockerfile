FROM ghcr.io/openfaas/classic-watchdog:0.2.0 as watchdog

FROM tensorflow/tensorflow

RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install --no-cache-dir --upgrade tensorflow-hub

COPY --from=watchdog /fwatchdog /usr/bin/fwatchdog
RUN chmod +x /usr/bin/fwatchdog

RUN useradd -ms /bin/bash tfhub
USER tfhub
WORKDIR /home/tfhub

COPY --chown=tfhub ./requirements.txt .
RUN python3 -m pip install --no-cache-dir -r requirements.txt

COPY --chown=tfhub ./index.py .
COPY --chown=tfhub ./function ./function
RUN python3 -m pip install --no-cache-dir -r ./function/requirements.txt     

ENV TF_CPP_MIN_LOG_LEVEL=3

ENV TFHUB_CACHE_DIR=./function/tfhub_modules

ENV write_debug="true"
ENV fprocess="python3 index.py"

RUN chmod +x /home/tfhub/function/run.sh
CMD ["/bin/bash", "/home/tfhub/function/run.sh"]