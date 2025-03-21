import { useSource, useTitle } from "@/hooks/useTitle";
import { ColumnProps, Table } from "react-fluid-table";
import { TestData, testData } from "../data";
import { Input } from "@/components/ui/input";

const countries = [
  { name: "Afghanistan", countryCode: "af" },
  { name: "Aland Islands", countryCode: "ax" },
  { name: "Albania", countryCode: "al" },
  { name: "Algeria", countryCode: "dz" },
  { name: "American Samoa", countryCode: "as" },
  { name: "Andorra", countryCode: "ad" },
  { name: "Angola", countryCode: "ao" },
  { name: "Anguilla", countryCode: "ai" },
  { name: "Antigua", countryCode: "ag" },
  { name: "Argentina", countryCode: "ar" },
  { name: "Armenia", countryCode: "am" },
  { name: "Aruba", countryCode: "aw" },
  { name: "Australia", countryCode: "au" },
  { name: "Austria", countryCode: "at" },
  { name: "Azerbaijan", countryCode: "az" },
  { name: "Bahamas", countryCode: "bs" },
  { name: "Bahrain", countryCode: "bh" },
  { name: "Bangladesh", countryCode: "bd" },
  { name: "Barbados", countryCode: "bb" },
  { name: "Belarus", countryCode: "by" },
  { name: "Belgium", countryCode: "be" },
  { name: "Belize", countryCode: "bz" },
  { name: "Benin", countryCode: "bj" },
  { name: "Bermuda", countryCode: "bm" },
  { name: "Bhutan", countryCode: "bt" },
  { name: "Bolivia", countryCode: "bo" },
  { name: "Bosnia", countryCode: "ba" },
  { name: "Botswana", countryCode: "bw" },
  { name: "Bouvet Island", countryCode: "bv" },
  { name: "Brazil", countryCode: "br" },
  { name: "British Virgin Islands", countryCode: "vg" },
  { name: "Brunei", countryCode: "bn" },
  { name: "Bulgaria", countryCode: "bg" },
  { name: "Burkina Faso", countryCode: "bf" },
  { name: "Burma", countryCode: "mm", alias: "Myanmar" },
  { name: "Burundi", countryCode: "bi" },
  { name: "Caicos Islands", countryCode: "tc" },
  { name: "Cambodia", countryCode: "kh" },
  { name: "Cameroon", countryCode: "cm" },
  { name: "Canada", countryCode: "ca" },
  { name: "Cape Verde", countryCode: "cv" },
  { name: "Cayman Islands", countryCode: "ky" },
  { name: "Central African Republic", countryCode: "cf" },
  { name: "Chad", countryCode: "td" },
  { name: "Chile", countryCode: "cl" },
  { name: "China", countryCode: "cn" },
  { name: "Christmas Island", countryCode: "cx" },
  { name: "Cocos Islands", countryCode: "cc" },
  { name: "Colombia", countryCode: "co" },
  { name: "Comoros", countryCode: "km" },
  { name: "Congo", countryCode: "cd" },
  { name: "Congo Brazzaville", countryCode: "cg" },
  { name: "Cook Islands", countryCode: "ck" },
  { name: "Costa Rica", countryCode: "cr" },
  { name: "Cote Divoire", countryCode: "ci" },
  { name: "Croatia", countryCode: "hr" },
  { name: "Cuba", countryCode: "cu" },
  { name: "Cyprus", countryCode: "cy" },
  { name: "Czech Republic", countryCode: "cz" },
  { name: "Denmark", countryCode: "dk" },
  { name: "Djibouti", countryCode: "dj" },
  { name: "Dominica", countryCode: "dm" },
  { name: "Dominican Republic", countryCode: "do" },
  { name: "Ecuador", countryCode: "ec" },
  { name: "Egypt", countryCode: "eg" },
  { name: "El Salvador", countryCode: "sv" },
  { name: "Equatorial Guinea", countryCode: "gq" },
  { name: "Eritrea", countryCode: "er" },
  { name: "Estonia", countryCode: "ee" },
  { name: "Ethiopia", countryCode: "et" },
  { name: "Europeanunion", countryCode: "eu" },
  { name: "Falkland Islands", countryCode: "fk" },
  { name: "Faroe Islands", countryCode: "fo" },
  { name: "Fiji", countryCode: "fj" },
  { name: "Finland", countryCode: "fi" },
  { name: "France", countryCode: "fr" },
  { name: "French Guiana", countryCode: "gf" },
  { name: "French Polynesia", countryCode: "pf" },
  { name: "French Territories", countryCode: "tf" },
  { name: "Gabon", countryCode: "ga" },
  { name: "Gambia", countryCode: "gm" },
  { name: "Georgia", countryCode: "ge" },
  { name: "Germany", countryCode: "de" },
  { name: "Ghana", countryCode: "gh" },
  { name: "Gibraltar", countryCode: "gi" },
  { name: "Greece", countryCode: "gr" },
  { name: "Greenland", countryCode: "gl" },
  { name: "Grenada", countryCode: "gd" },
  { name: "Guadeloupe", countryCode: "gp" },
  { name: "Guam", countryCode: "gu" },
  { name: "Guatemala", countryCode: "gt" },
  { name: "Guinea", countryCode: "gn" },
  { name: "Guinea-Bissau", countryCode: "gw" },
  { name: "Guyana", countryCode: "gy" },
  { name: "Haiti", countryCode: "ht" },
  { name: "Heard Island", countryCode: "hm" },
  { name: "Honduras", countryCode: "hn" },
  { name: "Hong Kong", countryCode: "hk" },
  { name: "Hungary", countryCode: "hu" },
  { name: "Iceland", countryCode: "is" },
  { name: "India", countryCode: "in" },
  { name: "Indian Ocean Territory", countryCode: "io" },
  { name: "Indonesia", countryCode: "id" },
  { name: "Iran", countryCode: "ir" },
  { name: "Iraq", countryCode: "iq" },
  { name: "Ireland", countryCode: "ie" },
  { name: "Israel", countryCode: "il" },
  { name: "Italy", countryCode: "it" },
  { name: "Jamaica", countryCode: "jm" },
  { name: "Jan Mayen", countryCode: "sj", alias: "Svalbard" },
  { name: "Japan", countryCode: "jp" },
  { name: "Jordan", countryCode: "jo" },
  { name: "Kazakhstan", countryCode: "kz" },
  { name: "Kenya", countryCode: "ke" },
  { name: "Kiribati", countryCode: "ki" },
  { name: "Kuwait", countryCode: "kw" },
  { name: "Kyrgyzstan", countryCode: "kg" },
  { name: "Laos", countryCode: "la" },
  { name: "Latvia", countryCode: "lv" },
  { name: "Lebanon", countryCode: "lb" },
  { name: "Lesotho", countryCode: "ls" },
  { name: "Liberia", countryCode: "lr" },
  { name: "Libya", countryCode: "ly" },
  { name: "Liechtenstein", countryCode: "li" },
  { name: "Lithuania", countryCode: "lt" },
  { name: "Luxembourg", countryCode: "lu" },
  { name: "Macau", countryCode: "mo" },
  { name: "Macedonia", countryCode: "mk" },
  { name: "Madagascar", countryCode: "mg" },
  { name: "Malawi", countryCode: "mw" },
  { name: "Malaysia", countryCode: "my" },
  { name: "Maldives", countryCode: "mv" },
  { name: "Mali", countryCode: "ml" },
  { name: "Malta", countryCode: "mt" },
  { name: "Marshall Islands", countryCode: "mh" },
  { name: "Martinique", countryCode: "mq" },
  { name: "Mauritania", countryCode: "mr" },
  { name: "Mauritius", countryCode: "mu" },
  { name: "Mayotte", countryCode: "yt" },
  { name: "Mexico", countryCode: "mx" },
  { name: "Micronesia", countryCode: "fm" },
  { name: "Moldova", countryCode: "md" },
  { name: "Monaco", countryCode: "mc" },
  { name: "Mongolia", countryCode: "mn" },
  { name: "Montenegro", countryCode: "me" },
  { name: "Montserrat", countryCode: "ms" },
  { name: "Morocco", countryCode: "ma" },
  { name: "Mozambique", countryCode: "mz" },
  { name: "Namibia", countryCode: "na" },
  { name: "Nauru", countryCode: "nr" },
  { name: "Nepal", countryCode: "np" },
  { name: "Netherlands", countryCode: "nl" },
  { name: "Netherlandsantilles", countryCode: "an" },
  { name: "New Caledonia", countryCode: "nc" },
  { name: "New Guinea", countryCode: "pg" },
  { name: "New Zealand", countryCode: "nz" },
  { name: "Nicaragua", countryCode: "ni" },
  { name: "Niger", countryCode: "ne" },
  { name: "Nigeria", countryCode: "ng" },
  { name: "Niue", countryCode: "nu" },
  { name: "Norfolk Island", countryCode: "nf" },
  { name: "North Korea", countryCode: "kp" },
  { name: "Northern Mariana Islands", countryCode: "mp" },
  { name: "Norway", countryCode: "no" },
  { name: "Oman", countryCode: "om" },
  { name: "Pakistan", countryCode: "pk" },
  { name: "Palau", countryCode: "pw" },
  { name: "Palestine", countryCode: "ps" },
  { name: "Panama", countryCode: "pa" },
  { name: "Paraguay", countryCode: "py" },
  { name: "Peru", countryCode: "pe" },
  { name: "Philippines", countryCode: "ph" },
  { name: "Pitcairn Islands", countryCode: "pn" },
  { name: "Poland", countryCode: "pl" },
  { name: "Portugal", countryCode: "pt" },
  { name: "Puerto Rico", countryCode: "pr" },
  { name: "Qatar", countryCode: "qa" },
  { name: "Reunion", countryCode: "re" },
  { name: "Romania", countryCode: "ro" },
  { name: "Russia", countryCode: "ru" },
  { name: "Rwanda", countryCode: "rw" },
  { name: "Saint Helena", countryCode: "sh" },
  { name: "Saint Kitts and Nevis", countryCode: "kn" },
  { name: "Saint Lucia", countryCode: "lc" },
  { name: "Saint Pierre", countryCode: "pm" },
  { name: "Saint Vincent", countryCode: "vc" },
  { name: "Samoa", countryCode: "ws" },
  { name: "San Marino", countryCode: "sm" },
  { name: "Sandwich Islands", countryCode: "gs" },
  { name: "Sao Tome", countryCode: "st" },
  { name: "Saudi Arabia", countryCode: "sa" },
  { name: "Scotland", countryCode: "gb sct" },
  { name: "Senegal", countryCode: "sn" },
  { name: "Serbia", countryCode: "cs" },
  { name: "Serbia", countryCode: "rs" },
  { name: "Seychelles", countryCode: "sc" },
  { name: "Sierra Leone", countryCode: "sl" },
  { name: "Singapore", countryCode: "sg" },
  { name: "Slovakia", countryCode: "sk" },
  { name: "Slovenia", countryCode: "si" },
  { name: "Solomon Islands", countryCode: "sb" },
  { name: "Somalia", countryCode: "so" },
  { name: "South Africa", countryCode: "za" },
  { name: "South Korea", countryCode: "kr" },
  { name: "Spain", countryCode: "es" },
  { name: "Sri Lanka", countryCode: "lk" },
  { name: "Sudan", countryCode: "sd" },
  { name: "Suriname", countryCode: "sr" },
  { name: "Swaziland", countryCode: "sz" },
  { name: "Sweden", countryCode: "se" },
  { name: "Switzerland", countryCode: "ch" },
  { name: "Syria", countryCode: "sy" },
  { name: "Taiwan", countryCode: "tw" },
  { name: "Tajikistan", countryCode: "tj" },
  { name: "Tanzania", countryCode: "tz" },
  { name: "Thailand", countryCode: "th" },
  { name: "Timorleste", countryCode: "tl" },
  { name: "Togo", countryCode: "tg" },
  { name: "Tokelau", countryCode: "tk" },
  { name: "Tonga", countryCode: "to" },
  { name: "Trinidad", countryCode: "tt" },
  { name: "Tunisia", countryCode: "tn" },
  { name: "Turkey", countryCode: "tr" },
  { name: "Turkmenistan", countryCode: "tm" },
  { name: "Tuvalu", countryCode: "tv" },
  { name: "U.A.E.", countryCode: "ae", alias: "United Arab Emirates" },
  { name: "Uganda", countryCode: "ug" },
  { name: "Ukraine", countryCode: "ua" },
  { name: "United Kingdom", countryCode: "gb", alias: "uk" },
  { name: "United States", countryCode: "us", alias: "America" },
  { name: "Uruguay", countryCode: "uy" },
  { name: "US Minor Islands", countryCode: "um" },
  { name: "US Virgin Islands", countryCode: "vi" },
  { name: "Uzbekistan", countryCode: "uz" },
  { name: "Vanuatu", countryCode: "vu" },
  { name: "Vatican City", countryCode: "va" },
  { name: "Venezuela", countryCode: "ve" },
  { name: "Vietnam", countryCode: "vn" },
  { name: "Wales", countryCode: "gb wls" },
  { name: "Wallis and Futuna", countryCode: "wf" },
  { name: "Western Sahara", countryCode: "eh" },
  { name: "Yemen", countryCode: "ye" },
  { name: "Zambia", countryCode: "zm" },
  { name: "Zimbabwe", countryCode: "zw" }
];

const countryMap = countries.reduce((pv, c) => ({ ...pv, [c.countryCode]: c.name }), {} as { [x: string]: string });

const columns: ColumnProps<TestData>[] = [
  {
    key: "id",
    header: "ID",
    width: 50
  },
  {
    key: "avatar",
    header: "Profile Photo",
    width: 150,
    content: ({ row }) => <img src={row.avatar} className="h-[134px] w-full" />
  },
  {
    key: "email",
    header: "Email",
    content: ({ row }) => <Input defaultValue={row.email} className="w-full" />
  },
  {
    key: "firstName",
    header: "First",
    width: 100,
    content: ({ row }) => (
      <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-light leading-[normal] text-black">
        {row.firstName}
      </div>
    )
  },
  {
    key: "lastName",
    header: "Last",
    width: 100,
    content: ({ row }) => (
      <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-light leading-[normal] text-black">
        {row.lastName}
      </div>
    )
  },
  {
    key: "country",
    header: "Country",
    content: ({ row }) => {
      const code = row.country.toUpperCase();
      return !countryMap[row.country] ? (
        <span>{`No flag for this country: ${code}`}</span>
      ) : (
        <div className="flex items-center gap-x-4">
          <div className={`flag:${code}`} />
          <span>{countryMap[row.country]}</span>
        </div>
      );
    }
  }
];

const Source = `
const data = [/* ... */];

const columns: ColumnProps<TestData>[] = [
  {
    key: "id",
    header: "ID",
    width: 50
  },
  {
    key: "avatar",
    header: "Profile Photo",
    width: 150,
    content: ({ row }) => <ProfPic size="small" src={row.avatar} />
  },
  {
    key: "email",
    header: "Email",
    content: ({ row }) => <EmailInput defaultValue={row.email} />
  },
  {
    key: "firstName",
    header: "First",
    width: 100,
    content: ({ row }) => (
      <div className="text-sm font-light leading-[normal] text-black whitespace-nowrap overflow-hidden text-ellipsis">
        {row.firstName}
      </div>
    )
  },
  {
    key: "lastName",
    header: "Last",
    width: 100,
    content: ({ row }) => (
      <div className="text-sm font-light leading-[normal] text-black whitespace-nowrap overflow-hidden text-ellipsis">
        {row.lastName}
      </div>
    )
  },
  {
    key: "country",
    header: "Country",
    content: ({ row }) =>
      !countryMap[row.country] ? (
        \`No flag for this country: \${row.country.toUpperCase()}\`
      ) : (
        <>
          <Flag name={row.country as FlagNameValues} />
          {countryMap[row.country]}
        </>
      )
  }
];

const Example = () => (
  <Table
    data={data}
    columns={columns}
    tableHeight={400}
    rowHeight={150}
  />
);
`;

const Example4 = () => {
  useTitle("Cell Content");
  useSource(Source);
  return <Table data={testData} columns={columns} tableHeight={400} rowHeight={150} />;
};

export { Example4 };
