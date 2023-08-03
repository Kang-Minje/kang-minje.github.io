import 'package:flutter/material.dart';
import 'package:adobe_xd/pinned.dart';
import 'package:flutter_svg/flutter_svg.dart';

class XDLandingPage extends StatelessWidget {
  XDLandingPage({
    Key key,
  }) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xffffffff),
      body: Stack(
        children: <Widget>[
          // Adobe XD layer: 'Lines' (group)
          Stack(
            children: <Widget>[
              Pinned.fromPins(
                Pin(size: 1.0, start: 53.5),
                Pin(start: 0.0, end: 0.0),
                child:
                    // Adobe XD layer: 'Line.vertical1' (shape)
                    SvgPicture.string(
                  _svg_b5cm5f,
                  allowDrawingOutsideViewBox: true,
                  fit: BoxFit.fill,
                ),
              ),
              Pinned.fromPins(
                Pin(size: 1.0, start: 463.5),
                Pin(start: 0.0, end: 0.0),
                child:
                    // Adobe XD layer: 'Line.vertical2' (shape)
                    SvgPicture.string(
                  _svg_qo0kfx,
                  allowDrawingOutsideViewBox: true,
                  fit: BoxFit.fill,
                ),
              ),
              Pinned.fromPins(
                Pin(size: 1.0, middle: 0.4677),
                Pin(start: 0.0, end: 0.0),
                child:
                    // Adobe XD layer: 'Line.vertical3' (shape)
                    SvgPicture.string(
                  _svg_v3ypr,
                  allowDrawingOutsideViewBox: true,
                  fit: BoxFit.fill,
                ),
              ),
              Pinned.fromPins(
                Pin(start: 0.0, end: 0.0),
                Pin(size: 1.0, start: 37.0),
                child:
                    // Adobe XD layer: 'Line.Header' (shape)
                    SvgPicture.string(
                  _svg_odde,
                  allowDrawingOutsideViewBox: true,
                  fit: BoxFit.fill,
                ),
              ),
            ],
          ),
          Pinned.fromPins(
            Pin(size: 336.0, middle: 0.3232),
            Pin(size: 147.0, start: 114.0),
            child:
                // Adobe XD layer: 'Sec02' (group)
                Stack(
              children: <Widget>[
                // Adobe XD layer: 'selectedworks' (group)
                Stack(
                  children: <Widget>[
                    Pinned.fromPins(
                      Pin(size: 39.0, start: 297.0),
                      Pin(size: 15.0, start: 132.0),
                      child:
                          // Adobe XD layer: 'year.Superposition' (text)
                          Text(
                        '2023~',
                        style: TextStyle(
                          fontFamily: 'Nanum Myeongjo',
                          fontSize: 13,
                          color: const Color(0xff000000),
                          letterSpacing: 0.39,
                          fontWeight: FontWeight.w800,
                        ),
                        textAlign: TextAlign.right,
                        softWrap: false,
                      ),
                    ),
                    Pinned.fromPins(
                      Pin(size: 82.0, start: 0.0),
                      Pin(size: 15.0, start: 132.0),
                      child:
                          // Adobe XD layer: 'works.Superposition' (text)
                          Text(
                        'Superposition',
                        style: TextStyle(
                          fontFamily: 'Nanum Myeongjo',
                          fontSize: 13,
                          color: const Color(0xff000000),
                          letterSpacing: 0.39,
                          fontWeight: FontWeight.w800,
                        ),
                        softWrap: false,
                      ),
                    ),
                    Pinned.fromPins(
                      Pin(size: 29.0, start: 297.0),
                      Pin(size: 15.0, start: 112.0),
                      child:
                          // Adobe XD layer: 'year.TheWhiteWall' (text)
                          Text(
                        '2023',
                        style: TextStyle(
                          fontFamily: 'Nanum Myeongjo',
                          fontSize: 13,
                          color: const Color(0xff000000),
                          letterSpacing: 0.39,
                          fontWeight: FontWeight.w800,
                        ),
                        textAlign: TextAlign.right,
                        softWrap: false,
                      ),
                    ),
                    Pinned.fromPins(
                      Pin(size: 94.0, start: 0.0),
                      Pin(size: 15.0, start: 112.0),
                      child:
                          // Adobe XD layer: 'works.TheWhiteWall' (text)
                          Text(
                        'The White Wall',
                        style: TextStyle(
                          fontFamily: 'Nanum Myeongjo',
                          fontSize: 13,
                          color: const Color(0xff000000),
                          letterSpacing: 0.39,
                          fontWeight: FontWeight.w800,
                        ),
                        softWrap: false,
                      ),
                    ),
                    Pinned.fromPins(
                      Pin(size: 39.0, start: 297.0),
                      Pin(size: 15.0, start: 92.0),
                      child:
                          // Adobe XD layer: 'year.Suseok' (text)
                          Text(
                        '2023~',
                        style: TextStyle(
                          fontFamily: 'Nanum Myeongjo',
                          fontSize: 13,
                          color: const Color(0xff000000),
                          letterSpacing: 0.39,
                          fontWeight: FontWeight.w800,
                        ),
                        textAlign: TextAlign.right,
                        softWrap: false,
                      ),
                    ),
                    Pinned.fromPins(
                      Pin(size: 41.0, start: 0.0),
                      Pin(size: 15.0, start: 92.0),
                      child:
                          // Adobe XD layer: 'works.Suseok' (text)
                          Text(
                        'Suseok',
                        style: TextStyle(
                          fontFamily: 'Nanum Myeongjo',
                          fontSize: 13,
                          color: const Color(0xff000000),
                          letterSpacing: 0.39,
                          fontWeight: FontWeight.w800,
                        ),
                        softWrap: false,
                      ),
                    ),
                    Pinned.fromPins(
                      Pin(size: 39.0, start: 297.0),
                      Pin(size: 15.0, start: 72.0),
                      child:
                          // Adobe XD layer: 'year.Portraits' (text)
                          Text(
                        '2021~',
                        style: TextStyle(
                          fontFamily: 'Nanum Myeongjo',
                          fontSize: 13,
                          color: const Color(0xff000000),
                          letterSpacing: 0.39,
                          fontWeight: FontWeight.w800,
                        ),
                        textAlign: TextAlign.right,
                        softWrap: false,
                      ),
                    ),
                    Pinned.fromPins(
                      Pin(size: 51.0, start: 0.0),
                      Pin(size: 15.0, start: 72.0),
                      child:
                          // Adobe XD layer: 'works.Portraits' (text)
                          Text(
                        'Portraits',
                        style: TextStyle(
                          fontFamily: 'Nanum Myeongjo',
                          fontSize: 13,
                          color: const Color(0xff000000),
                          letterSpacing: 0.39,
                          fontWeight: FontWeight.w800,
                        ),
                        softWrap: false,
                      ),
                    ),
                    Pinned.fromPins(
                      Pin(size: 29.0, start: 297.0),
                      Pin(size: 15.0, start: 40.0),
                      child:
                          // Adobe XD layer: 'year.FlyingBobs' (text)
                          Text(
                        '2023',
                        style: TextStyle(
                          fontFamily: 'Nanum Myeongjo',
                          fontSize: 13,
                          color: const Color(0xff000000),
                          letterSpacing: 0.39,
                          fontWeight: FontWeight.w800,
                        ),
                        textAlign: TextAlign.right,
                        softWrap: false,
                      ),
                    ),
                    Pinned.fromPins(
                      Pin(size: 178.0, start: 0.0),
                      Pin(size: 15.0, start: 40.0),
                      child:
                          // Adobe XD layer: 'works.FlyingBobs' (text)
                          Text(
                        'Flying Bobs (Fan-Made MV)',
                        style: TextStyle(
                          fontFamily: 'Nanum Myeongjo',
                          fontSize: 13,
                          color: const Color(0xff000000),
                          letterSpacing: 0.39,
                          fontWeight: FontWeight.w800,
                        ),
                        softWrap: false,
                      ),
                    ),
                    Pinned.fromPins(
                      Pin(size: 29.0, start: 297.0),
                      Pin(size: 15.0, start: 20.0),
                      child:
                          // Adobe XD layer: 'year.Afterglow' (text)
                          Text(
                        '2020',
                        style: TextStyle(
                          fontFamily: 'Nanum Myeongjo',
                          fontSize: 13,
                          color: const Color(0xff000000),
                          letterSpacing: 0.39,
                          fontWeight: FontWeight.w800,
                        ),
                        textAlign: TextAlign.right,
                        softWrap: false,
                      ),
                    ),
                    Pinned.fromPins(
                      Pin(size: 60.0, start: 0.0),
                      Pin(size: 15.0, start: 20.0),
                      child:
                          // Adobe XD layer: 'works.Afterglow' (text)
                          Text(
                        'Afterglow',
                        style: TextStyle(
                          fontFamily: 'Nanum Myeongjo',
                          fontSize: 13,
                          color: const Color(0xff000000),
                          letterSpacing: 0.39,
                          fontWeight: FontWeight.w800,
                        ),
                        softWrap: false,
                      ),
                    ),
                    Pinned.fromPins(
                      Pin(size: 29.0, start: 297.0),
                      Pin(size: 15.0, start: 0.0),
                      child:
                          // Adobe XD layer: 'year.Dust' (text)
                          Text(
                        '2020',
                        style: TextStyle(
                          fontFamily: 'Nanum Myeongjo',
                          fontSize: 13,
                          color: const Color(0xff000000),
                          letterSpacing: 0.39,
                          fontWeight: FontWeight.w800,
                        ),
                        textAlign: TextAlign.right,
                        softWrap: false,
                      ),
                    ),
                    Align(
                      alignment: Alignment.topLeft,
                      child: SizedBox(
                        width: 28.0,
                        height: 15.0,
                        child:
                            // Adobe XD layer: 'works.Dust' (text)
                            Text(
                          'Dust',
                          style: TextStyle(
                            fontFamily: 'Nanum Myeongjo',
                            fontSize: 13,
                            color: const Color(0xff000000),
                            letterSpacing: 0.39,
                            fontWeight: FontWeight.w800,
                          ),
                          softWrap: false,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Pinned.fromPins(
            Pin(size: 403.0, start: 31.0),
            Pin(start: 29.0, end: 29.0),
            child:
                // Adobe XD layer: 'Sec01' (group)
                Stack(
              children: <Widget>[
                Align(
                  alignment: Alignment.bottomLeft,
                  child: SizedBox(
                    width: 146.0,
                    height: 82.0,
                    child:
                        // Adobe XD layer: 'footer' (group)
                        Stack(
                      children: <Widget>[
                        Align(
                          alignment: Alignment.topLeft,
                          child: SizedBox(
                            width: 50.0,
                            height: 14.0,
                            child:
                                // Adobe XD layer: 'footer.findme' (text)
                                Text(
                              'Find me:',
                              style: TextStyle(
                                fontFamily: 'Nanum Myeongjo',
                                fontSize: 12,
                                color: const Color(0xff000000),
                                letterSpacing: 0.36,
                                fontWeight: FontWeight.w800,
                              ),
                              softWrap: false,
                            ),
                          ),
                        ),
                        Align(
                          alignment: Alignment.bottomLeft,
                          child: SizedBox(
                            width: 70.0,
                            height: 14.0,
                            child:
                                // Adobe XD layer: 'footer.loc' (text)
                                Text(
                              'Seoul, Korea',
                              style: TextStyle(
                                fontFamily: 'Nanum Myeongjo',
                                fontSize: 12,
                                color: const Color(0xff000000),
                                letterSpacing: 0.36,
                                fontWeight: FontWeight.w800,
                              ),
                              softWrap: false,
                            ),
                          ),
                        ),
                        Align(
                          alignment: Alignment(-1.0, 0.176),
                          child: SizedBox(
                            width: 55.0,
                            height: 14.0,
                            child:
                                // Adobe XD layer: 'footer.insta' (text)
                                Text(
                              'Instagram',
                              style: TextStyle(
                                fontFamily: 'Nanum Myeongjo',
                                fontSize: 12,
                                color: const Color(0xff000000),
                                letterSpacing: 0.36,
                                fontWeight: FontWeight.w800,
                              ),
                              softWrap: false,
                            ),
                          ),
                        ),
                        Align(
                          alignment: Alignment(-1.0, -0.147),
                          child: SizedBox(
                            width: 102.0,
                            height: 14.0,
                            child:
                                // Adobe XD layer: 'footer.number' (text)
                                Text(
                              '+82)10 9323 9432',
                              style: TextStyle(
                                fontFamily: 'Nanum Myeongjo',
                                fontSize: 12,
                                color: const Color(0xff000000),
                                letterSpacing: 0.36,
                                fontWeight: FontWeight.w800,
                              ),
                              softWrap: false,
                            ),
                          ),
                        ),
                        Pinned.fromPins(
                          Pin(start: 0.0, end: 0.0),
                          Pin(size: 14.0, middle: 0.2206),
                          child:
                              // Adobe XD layer: 'footer.mail' (text)
                              Text(
                            'kangminje000@gmail.com',
                            style: TextStyle(
                              fontFamily: 'Nanum Myeongjo',
                              fontSize: 12,
                              color: const Color(0xff000000),
                              letterSpacing: 0.36,
                              fontWeight: FontWeight.w800,
                            ),
                            softWrap: false,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Pinned.fromPins(
                  Pin(start: 0.0, end: 0.0),
                  Pin(size: 267.0, start: 85.0),
                  child:
                      // Adobe XD layer: 'dsc' (group)
                      Stack(
                    children: <Widget>[
                      Align(
                        alignment: Alignment.topLeft,
                        child: SizedBox(
                          width: 403.0,
                          height: 105.0,
                          child:
                              // Adobe XD layer: 'dsc.ko' (text)
                              Text(
                            '시각적인 쾌락을 추구하며, 생산해낸 - \n낼 이미지를 통해 즐기게 한다.\n\n이것이 제가 이미지를 만드는 이유입니다.\n이미지의 풍요로움은 사람들에게 욕구의 만족을 보장했습니다.\n강민제는 현재의 범람하는 이미지들 속에서 높은 질의 이미지를 \n생산하여 시각적 쾌락이라는 욕망을 실현합니다.',
                            style: TextStyle(
                              fontFamily: 'Nanum Myeongjo',
                              fontSize: 13,
                              color: const Color(0xff000000),
                              letterSpacing: 0.39,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                      ),
                      Pinned.fromPins(
                        Pin(start: 0.0, end: 0.0),
                        Pin(size: 128.0, end: 0.0),
                        child:
                            // Adobe XD layer: 'dsc.en' (text)
                            Text(
                          'Pursuing visual pleasure and make people to enjoy it\nthrough the images that I produced. (and will produce).\n\nThis is why Kang Minje creates images.\nThe richness of the image ensured the satisfaction \nof people’s needs. Kang Minje realizes his desire\nfor visual pleasure by producing high-quality images \namong the current flooding images.',
                          style: TextStyle(
                            fontFamily: 'Nanum Myeongjo',
                            fontSize: 14,
                            color: const Color(0xff000000),
                            letterSpacing: 0.42,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Align(
                  alignment: Alignment.topLeft,
                  child: SizedBox(
                    width: 44.0,
                    height: 16.0,
                    child:
                        // Adobe XD layer: 'header' (group)
                        Stack(
                      children: <Widget>[
                        Pinned.fromPins(
                          Pin(start: 0.0, end: 0.0),
                          Pin(size: 16.0, middle: 0.5),
                          child:
                              // Adobe XD layer: 'Header.name' (text)
                              Text(
                            '강민제',
                            style: TextStyle(
                              fontFamily: 'Nanum Myeongjo',
                              fontSize: 14,
                              color: const Color(0xff000000),
                              letterSpacing: 0.42,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

const String _svg_b5cm5f =
    '<svg viewBox="53.0 0.0 1.0 1080.0" ><path transform="translate(53.0, 0.0)" d="M 0 0 L 0 1080" fill="none" stroke="#ff71fa" stroke-width="0.30000001192092896" stroke-miterlimit="4" stroke-linecap="butt" /></svg>';
const String _svg_qo0kfx =
    '<svg viewBox="463.0 0.0 1.0 1080.0" ><path transform="translate(463.0, 0.0)" d="M 0 0 L 0 1080" fill="none" stroke="#ff71fa" stroke-width="0.30000001192092896" stroke-miterlimit="4" stroke-linecap="butt" /></svg>';
const String _svg_v3ypr =
    '<svg viewBox="880.0 0.0 1.0 1080.0" ><path transform="translate(880.0, 0.0)" d="M 0 0 L 0 1080" fill="none" stroke="#ff71fa" stroke-width="0.30000001192092896" stroke-miterlimit="4" stroke-linecap="butt" /></svg>';
const String _svg_odde =
    '<svg viewBox="-0.5 37.0 1883.5 1.0" ><path transform="translate(-0.49, 37.0)" d="M 1883.490356445312 0 L 0 0" fill="none" stroke="#ff71fa" stroke-width="0.30000001192092896" stroke-miterlimit="4" stroke-linecap="butt" /></svg>';
