// Fallback for using Hugeicons on Android and web.

import { HugeiconsIcon } from '@hugeicons/react-native';
import { SymbolWeight } from 'expo-symbols';
import { OpaqueColorValue, type StyleProp, type ViewStyle } from 'react-native';
import {
  Home01Icon,
  SentIcon,
  CodeIcon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  UserIcon,
  Mail01Icon,
  LockIcon,
  EyeIcon,
  ArrowRightIcon,
  AiPhone01Icon,
  Car01Icon,
  IdentificationIcon,
  GoogleIcon,
  AppleIcon,
  CreditCardIcon,
  Settings01Icon,
  StarIcon,
  Building01Icon,
  File01Icon,
  InformationCircleIcon,
  Clock01Icon,
  QuestionIcon,
  Shield01Icon,
  Location01Icon,
  ShippingTruck01Icon,
  MapPinIcon,
  Share01Icon,
  Notification01Icon,
  Menu01Icon,
} from '@hugeicons/core-free-icons';

const MAPPING: Record<string, any> = {
  'house.fill': Home01Icon,
  'paperplane.fill': SentIcon,
  'chevron.left.forwardslash.chevron.right': CodeIcon,
  'chevron.right': ArrowRight01Icon,
  'chevron.left': ArrowLeft01Icon,
  'person': UserIcon,
  'person.fill': UserIcon,
  'envelope': Mail01Icon,
  'envelope.fill': Mail01Icon,
  'lock': LockIcon,
  'lock.fill': LockIcon,
  'eye': EyeIcon,
  'eye.slash': EyeIcon,
  'arrow.right': ArrowRightIcon,
  'phone.fill': AiPhone01Icon,
  'car.fill': Car01Icon,
  'identification': IdentificationIcon,
  'g.circle.fill': GoogleIcon,
  'apple.logo': AppleIcon,
  'list.bullet': Menu01Icon,
  'creditcard.fill': CreditCardIcon,
  'gearshape.fill': Settings01Icon,
  'star.fill': StarIcon,
  'building.2.fill': Building01Icon,
  'doc.text.fill': File01Icon,
  'info.circle.fill': InformationCircleIcon,
  'clock.fill': Clock01Icon,
  'questionmark.circle.fill': QuestionIcon,
  'shield.fill': Shield01Icon,
  'arrow.right.square.fill': ArrowRightIcon,
  'location.fill': Location01Icon,
  'shippingbox.fill': ShippingTruck01Icon,
  'mappin.circle.fill': MapPinIcon,
  'square.and.arrow.up': Share01Icon,
  'bell.fill': Notification01Icon,
  'line.3.horizontal': Menu01Icon,
};

/**
 * An icon component that uses native SF Symbols on iOS, and Hugeicons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Hugeicons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  const IconComponent = MAPPING[name];
  if (!IconComponent) {
    return null;
  }
  return <HugeiconsIcon icon={IconComponent} size={size} color={color as string} style={style} />;
}
