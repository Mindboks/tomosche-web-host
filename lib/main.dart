import 'dart:js' as js;
import 'package:flutter/material.dart';

// JavaScriptのliffをDartから叩くためのラッパー
Future<void> initLiff() async {
  js.context.callMethod('liff.init', [
    js.JsObject.jsify({'liffId': 'YOUR_LIFF_ID'}),
  ]);
}

// プロフィール取得の例
void getProfile() {
  js.context.callMethod('liff.getProfile');
}

void main() async {
  // Flutterのエンジン起動を待機
  WidgetsFlutterBinding.ensureInitialized();

  // LIFFの初期化（※LIFF IDはLINE Developersから取得したものに書き換えてください）
  await Liff.init(liffId: 'YOUR_LIFF_ID');

  runApp(const TomoscheApp());
}

class TomoscheApp extends StatelessWidget {
  const TomoscheApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(title: 'Tomosche', home: const AuthCheckScreen());
  }
}

class AuthCheckScreen extends StatefulWidget {
  const AuthCheckScreen({super.key});

  @override
  State<AuthCheckScreen> createState() => _AuthCheckScreenState();
}

class _AuthCheckScreenState extends State<AuthCheckScreen> {
  String _message = "LIFFを読み込んでいます...";

  @override
  void initState() {
    super.initState();
    _checkLiff();
  }

  Future<void> _checkLiff() async {
    try {
      // ユーザーのプロフィールを取得してLINE IDを表示
      final profile = await Liff.getProfile();
      setState(() {
        _message =
            "ログイン成功！\nユーザー名: ${profile.displayName}\nLINE ID: ${profile.userId}";
      });
    } catch (e) {
      setState(() {
        _message = "エラーが発生しました: $e";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Tomosche - 友助")),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Text(
            _message,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 18),
          ),
        ),
      ),
    );
  }
}
