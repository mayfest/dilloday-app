export const SPONSOR_BOOTHS: {
  name: string;
  logo: any;
  url?: string;
  activity: {
    name: string;
    description: string;
    image: any;
    location: string;
  };
}[] = [
  {
    name: 'Chicago White Sox',
    logo: require('@/assets/images/company-logos/chicago-white-sox.png'),
    url: 'https://www.mlb.com/whitesox',
    activity: {
      name: 'White Sox Booth',
      description:
        'Visit the Chicago White Sox booth for team merchandise and interactive experiences.',
      image: require('@/assets/images/company-logos/chicago-white-sox.png'),
      location: 'Sponsor Area',
    },
  },
  {
    name: 'Pretty Cool Ice Cream',
    logo: require('@/assets/images/company-logos/pretty-cool.png'),
    url: 'https://www.prettycoolcream.com',
    activity: {
      name: 'Ice Cream Booth',
      description:
        'Enjoy delicious ice cream treats from Pretty Cool Ice Cream.',
      image: require('@/assets/images/company-logos/pretty-cool.png'),
      location: 'Food Court',
    },
  },
  {
    name: "L'Oreal",
    logo: require('@/assets/images/company-logos/l-oreal.png'),
    url: 'https://www.loreal.com',
    activity: {
      name: "L'Oreal Activation",
      description:
        "Experience L'Oreal's in-person activation and visit their booth for beauty product samples.",
      image: require('@/assets/images/company-logos/l-oreal.png'),
      location: 'Beauty Zone',
    },
  },
  {
    name: 'Animal Records',
    logo: require('@/assets/images/company-logos/animal-records.png'),
    url: 'https://www.animalrecords.com',
    activity: {
      name: 'Animal Records Booth',
      description:
        'Discover new music and artists at the Animal Records booth.',
      image: require('@/assets/images/company-logos/animal-records.png'),
      location: 'Music Area',
    },
  },
  {
    name: 'Crossroads',
    logo: require('@/assets/images/company-logos/crossroads.png'),
    url: 'https://www.crossroads.com',
    activity: {
      name: 'Crossroads Booth',
      description:
        'Visit the Crossroads booth to learn more about their products and services.',
      image: require('@/assets/images/company-logos/crossroads.png'),
      location: 'Main Pavilion',
    },
  },
  {
    name: 'AWH Photo',
    logo: require('@/assets/images/company-logos/photobooth-awh.jpg'),
    url: 'https://www.awh-photo.com',
    activity: {
      name: 'Photo Booth',
      description:
        'Capture memories at the AWH Photo Booth with friends and family.',
      image: require('@/assets/images/company-logos/photobooth-awh.jpg'),
      location: 'Entertainment Area',
    },
  },
  {
    name: 'Costa Coffee',
    logo: require('@/assets/images/company-logos/coasta-coffee.png'),
    url: 'https://www.costa.co.uk',
    activity: {
      name: 'Costa Coffee Booth',
      description: "Grab a delicious coffee or tea from Costa Coffee's booth.",
      image: require('@/assets/images/company-logos/coasta-coffee.png'),
      location: 'Beverage Area',
    },
  },
  {
    name: 'Lifetime',
    logo: require('@/assets/images/off-white.png'),
    url: 'https://www.lifetime.life',
    activity: {
      name: 'Lifetime Booth',
      description:
        'Learn about fitness programs and wellness offerings at the Lifetime booth.',
      image: require('@/assets/images/off-white.png'),
      location: 'Wellness Zone',
    },
  },
  {
    name: 'LOOK App',
    logo: require('@/assets/images/company-logos/LOOK-app.png'),
    url: 'https://www.lookapp.com',
    activity: {
      name: 'LOOK App Booth',
      description:
        'Discover the LOOK App at their self-operated booth with exclusive app demos.',
      image: require('@/assets/images/company-logos/LOOK-app.png'),
      location: 'Tech Corner',
    },
  },
  {
    name: 'Postmates (Intern Queen)',
    logo: require('@/assets/images/off-white.png'),
    url: 'https://www.postmates.com',
    activity: {
      name: 'Postmates Booth',
      description:
        'Visit the Postmates booth featuring Intern Queen for merchandise and special offers.',
      image: require('@/assets/images/off-white.png'),
      location: 'Sponsor Row',
    },
  },
];
