import type { IconType } from "react-icons";
import {
  FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaYoutube, FaReact, FaNodeJs,
  FaHtml5, FaCss3Alt, FaJava, FaAndroid, FaPython, FaGitAlt, FaFigma, FaLinux,
  FaDocker, FaAward, FaMedal, FaTrophy, FaMapMarkerAlt, FaClock, FaEnvelope,
  FaPhoneAlt, FaGlobe, FaBriefcase, FaGraduationCap, FaUserTie, FaCode, FaLock,
} from "react-icons/fa";
import {
  SiTypescript, SiJavascript, SiKotlin, SiExpress, SiPostgresql, SiMongodb,
  SiPrisma, SiTailwindcss, SiNextdotjs, SiVite, SiFirebase, SiCloudinary,
  SiMysql, SiVercel, SiRender, SiC, SiFlutter, SiCplusplus, SiReactrouter,
  SiAxios, SiSocketdotio, SiDatefns, SiJsonwebtokens, SiResend, SiBrevo, SiZod,
} from "react-icons/si";
import {
  MdWeb, MdSmartphone, MdDesignServices, MdStorage, MdBuild, MdEngineering,
  MdArticle, MdVerified, MdEmojiEvents, MdSchool, MdCalendarToday, MdStar,
} from "react-icons/md";
import { BsBriefcaseFill, BsPersonWorkspace } from "react-icons/bs";
import { GiSteeltoeBoots, GiBearFace } from "react-icons/gi";

// Keep this key list byte-identical to the public repo's lib/icons.tsx.
// Whatever key the picker below writes to the DB is what the public site
// will look up at render time.
export const ICONS: Record<string, IconType> = {
  FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaYoutube,
  FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJava, FaAndroid, FaPython,
  FaGitAlt, FaFigma, FaLinux, FaDocker, FaAward, FaMedal, FaTrophy,
  FaMapMarkerAlt, FaClock, FaEnvelope, FaPhoneAlt, FaGlobe, FaBriefcase,
  FaGraduationCap, FaUserTie, FaCode, FaLock,
  SiTypescript, SiJavascript, SiKotlin, SiExpress, SiPostgresql, SiMongodb,
  SiPrisma, SiTailwindcss, SiNextdotjs, SiVite, SiFirebase, SiCloudinary,
  SiMysql, SiVercel, SiRender, SiC, SiFlutter, SiCplusplus, SiReactrouter,
  SiAxios, SiSocketdotio, SiDatefns, SiJsonwebtokens, SiResend, SiBrevo, SiZod,
  MdWeb, MdSmartphone, MdDesignServices, MdStorage, MdBuild, MdEngineering,
  MdArticle, MdVerified, MdEmojiEvents, MdSchool, MdCalendarToday, MdStar,
  BsBriefcaseFill, BsPersonWorkspace, GiSteeltoeBoots, GiBearFace,
};

export const ICON_KEYS = Object.keys(ICONS);

export function Icon({ name, className }: { name?: string | null; className?: string }) {
  const Cmp = (name && ICONS[name]) || MdStar;
  return <Cmp className={className} />;
}
