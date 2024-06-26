import { AntDesign } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';

export type CrumbProps = {
  title: string;
  href: string;
  isSelected?: boolean;
};

export type BreadCrumbProps = {
  crumbs: CrumbProps[];
};

type CrumbComponent = {
  data: CrumbProps;
  isLast: boolean;
};

const defaultColor = 'black;';
const colorPressed = 'rgb(248 113 113)';

const Crumb = ({ data, isLast }: CrumbComponent) => {
  const router = useRouter();
  const [textColor, setTextColor] = useState(defaultColor);

  return (
    <>
      <View>
        <Text
          className={`mt-2.5 ${textColor} ${data.isSelected ? 'font-bold' : 'underline '}`}
          onPressIn={() => setTextColor('text-red-400')}
          onPressOut={() => setTextColor(defaultColor)}
          onPress={() => `${data.isSelected ? null : router.push(data.href)}`}>
          {data.title}
        </Text>
      </View>
      {!isLast && <AntDesign name="right" size={32} color={defaultColor} className="mx-2" />}
    </>
  );
};

export default function BreadCrumbs({ crumbs }: BreadCrumbProps) {
  const [color, setColor] = useState(defaultColor);

  return (
    <View className="flex flex-row bg-slate-300 p-6">
      <Link
        href="/dashboardPage"
        asChild
        onPressIn={() => setColor(colorPressed)}
        onPressOut={() => setColor(defaultColor)}>
        <AntDesign name="home" size={32} color={color} />
      </Link>
      <AntDesign name="right" size={32} color={defaultColor} className="mx-2" />
      {crumbs.map((crumb, indexCrumb) => (
        <Crumb key={crumb.title} data={crumb} isLast={crumbs.length - 1 === indexCrumb} />
      ))}
    </View>
  );
}
