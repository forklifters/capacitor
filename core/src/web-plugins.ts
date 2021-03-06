import { mergeWebPlugin } from './plugins';
import { App } from './web/app';
import { Camera } from './web/camera';
import { Device } from './web/device';
import { Geolocation } from './web/geolocation';
import { LocalNotifications } from './web/local-notifications';
import { Modals } from './web/modals';
import { SplashScreen } from './web/splash-screen';
import { Toast } from './web/toast';

export * from './web/app';
export * from './web/camera';
export * from './web/device';
export * from './web/geolocation';
export * from './web/local-notifications';
export * from './web/modals';
export * from './web/splash-screen';
export * from './web/toast';

mergeWebPlugin(App);
mergeWebPlugin(Camera);
mergeWebPlugin(Device);
mergeWebPlugin(Geolocation);
mergeWebPlugin(LocalNotifications);
mergeWebPlugin(Modals);
mergeWebPlugin(SplashScreen);
mergeWebPlugin(Toast);
