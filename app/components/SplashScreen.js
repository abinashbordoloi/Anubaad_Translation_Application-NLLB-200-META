import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';

const SplashScreenComponent = ({onSplashScreenHide}) => {
  useEffect(() => {
    const splashScreenTimer = setTimeout(() => {
      onSplashScreenHide();
    }, 5000);
    // 5 sec delay hobo

    return () => clearTimeout(splashScreenTimer); // component tu unmount korute Clearup
  }, [onSplashScreenHide]);

  return (
    <View style={styles.container}>
      <Image
        source={{uri: 'https://i.ibb.co/yRjmZ3y/transla-o-2.png'}}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 500,
    height: 500,
    resizeMode: 'contain',
  },
});

export default SplashScreenComponent;
