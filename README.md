# classroom-robot-service
英語教育支援知的ロボットサービス
## ディレクトリ（classroom_robot_service_ui）
```
classroom_robot_service_teacher_ui
├── css
│   └── main.css
├── js
│   ├── lib
│   │   └──・・・省略
│   └── main_create_form.js ■（ユーザインターフェースからJsonを出力するまでの機能を持つJavaScript）
├── output_json
│   ├── output_rules.json ■（（詳細版ルールベース）
│   └── simplified_output_rules.json ■（（簡易版ルールベース）
├── php
│   ├── simplified_write_json_from_form.php ■（(簡易版ルールベースを出力するphp)
│   └── write_json_from_form.php ■（（詳細版ルールベースを出力するphp）
├── selected_rules.json ■（(ルール一覧)
└── ui.html（ユーザインターフェース）
```
---
## ローカル環境  
- XAMPP(ポート番号:8080 デフォルトのまま)
> Djangoで作成したAPIでホワイトリストとして登録しているため、もし違うポート番号、環境を用いる際はDjangoプロジェクトのSettings.pyを編集
- Django開発用サーバ(ポート番号:8000 デフォルトのまま)
## バージョン
- python 3.8
- Django 4.1.2
- nltk 3.7
- django_cors_headers 3.13.0
- opennlp （リポジトリにあり）
- vue.js （リポジトリにあり）
- axios （リポジトリにあり）
## 環境設定
1. xamppをインストールしhtdocsにclassroom_robot_service_uiフォルダを格納
2. python仮想環境を作成しDjango、nltk、django_cors_headersをインストール
3. 仮想環境の名前/lib/python（バージョン)/site-packages内にpython-packages_for_api内の３つのフォルダを格納　
4. デフォルト設定であればXAMPPサーバ、Django開発用サーバを立てる
5. ドメイン名とパス（ローカル環境でデフォルトなら<notextile>http:localhost:8080</notextile>/classroom_robot_service_teacher_ui/ui.html)で動作を確認
