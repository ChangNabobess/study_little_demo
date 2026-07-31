# !/usr/bin/env python

import argparse
import json
import logging
import os
import time
import hmac
import hashlib
import base64
import urllib.parse
import requests

# config.json 路径：脚本位于 .claude/skills/workDiary/scripts/，向上 3 级到 .claude/
CONFIG_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    '..', '..', '..', 'config.json'
)


def load_config():
    """从 .claude/config.json 读取钉钉配置"""
    try:
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            return json.load(f).get('dingtalk', {})
    except FileNotFoundError:
        logging.warning("未找到配置文件 %s，请使用命令行参数", CONFIG_PATH)
        return {}
    except json.JSONDecodeError as e:
        logging.error("配置文件格式错误：%s", e)
        return {}


def setup_logger():
    logger = logging.getLogger()
    handler = logging.StreamHandler()
    handler.setFormatter(
        logging.Formatter('%(asctime)s %(name)-8s %(levelname)-8s %(message)s [%(filename)s:%(lineno)d]'))
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    return logger


def define_options():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--access_token', dest='access_token', default=None,
        help='机器人webhook的access_token（不传则从 .claude/config.json 读取）'
    )
    parser.add_argument(
        '--secret', dest='secret', default=None,
        help='secret（不传则从 .claude/config.json 读取）'
    )
    parser.add_argument(
        '--userid', dest='userid',
        help='待 @ 的钉钉用户ID，多个用逗号分隔 from https://open.dingtalk.com/document/orgapp/basic-concepts-beta#title-o8w-yj2-t8x '
    )
    parser.add_argument(
        '--at_mobiles', dest='at_mobiles',
        help='待 @ 的手机号，多个用逗号分隔'
    )
    parser.add_argument(
        '--is_at_all', dest='is_at_all', action='store_true',
        help='是否@所有人，指定则为True，不指定为False'
    )
    parser.add_argument(
        '--msg', dest='msg', default='钉钉，让进步发生',
        help='要发送的消息内容'
    )
    return parser.parse_args()


def send_custom_robot_group_message(access_token, secret, msg, at_user_ids=None, at_mobiles=None, is_at_all=False):
    """
    发送钉钉自定义机器人群消息
    :param access_token: 机器人webhook的access_token
    :param secret: 机器人安全设置的加签secret
    :param msg: 消息内容
    :param at_user_ids: @的用户ID列表
    :param at_mobiles: @的手机号列表
    :param is_at_all: 是否@所有人
    :return: 钉钉API响应
    """
    timestamp = str(round(time.time() * 1000))
    string_to_sign = f'{timestamp}\n{secret}'
    hmac_code = hmac.new(secret.encode('utf-8'), string_to_sign.encode('utf-8'), digestmod=hashlib.sha256).digest()
    sign = urllib.parse.quote_plus(base64.b64encode(hmac_code))

    url = f'https://oapi.dingtalk.com/robot/send?access_token={access_token}&timestamp={timestamp}&sign={sign}'

    body = {
        "at": {
            "isAtAll": str(is_at_all).lower(),
            "atUserIds": at_user_ids or [],
            "atMobiles": at_mobiles or []
        },
        "text": {
            "content": msg
        },
        "msgtype": "text"
    }
    headers = {'Content-Type': 'application/json'}
    resp = requests.post(url, json=body, headers=headers)
    logging.info("钉钉自定义机器人群消息响应：%s", resp.text)
    return resp.json()


def main():
    setup_logger()  # 初始化日志，确保发送响应可见
    options = define_options()
    config = load_config()

    # 凭证：命令行参数优先，否则用 config.json
    access_token = options.access_token or config.get('access_token')
    secret = options.secret or config.get('secret')
    if not access_token or not secret:
        logging.error("缺少 access_token 或 secret，请在 .claude/config.json 中配置或通过命令行传入")
        return

    # @用户ID：命令行优先，否则用 config.json（统一转为字符串，钉钉要求字符串）
    if options.userid:
        at_user_ids = [u.strip() for u in options.userid.split(',') if u.strip()]
    else:
        at_user_ids = [str(u) for u in config.get('at_user_ids', [])]

    # @手机号：命令行优先，否则用 config.json（统一转为字符串）
    if options.at_mobiles:
        at_mobiles = [m.strip() for m in options.at_mobiles.split(',') if m.strip()]
    else:
        at_mobiles = [str(m) for m in config.get('at_mobiles', [])]

    # 是否@所有人：命令行指定则 True，否则用 config.json
    is_at_all = options.is_at_all or config.get('is_at_all', False)

    result = send_custom_robot_group_message(
        access_token,
        secret,
        options.msg,
        at_user_ids=at_user_ids,
        at_mobiles=at_mobiles,
        is_at_all=is_at_all
    )

    # 明确打印发送结果，方便 CLI 判断成功与否
    if result.get('errcode') == 0:
        logging.info("✅ 钉钉消息发送成功")
    else:
        logging.error("❌ 钉钉消息发送失败：%s", result)


if __name__ == '__main__':
    main()