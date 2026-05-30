import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Tomosche',
      debugShowCheckedModeBanner: false, // 画面右上の「Debug」リボンを非表示
      theme: ThemeData(
        useMaterial3: true, // 世界標準のMaterial Design 3を適用
        colorSchemeSeed: Colors.deepPurple, // アプリのテーマカラー（お好みで！）
      ),
      home: const Scaffold(
        body: Center(
          child: Text(
            'Welcome to Tomosche!\nHello World!\nYour global journey starts here.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }
}
