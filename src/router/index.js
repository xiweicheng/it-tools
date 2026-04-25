import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AllTools from '../views/AllTools.vue'
import Category from '../views/Category.vue'
import TokenGenerator from '../tools/security/TokenGenerator.vue'
import HashText from '../tools/security/HashText.vue'
import Bcrypt from '../tools/security/Bcrypt.vue'
import UUIDGenerator from '../tools/security/UUIDGenerator.vue'
import ULIDGenerator from '../tools/security/ULIDGenerator.vue'
import PasswordStrengthChecker from '../tools/security/PasswordStrengthChecker.vue'
import HashComparator from '../tools/security/HashComparator.vue'
import JWTDecoder from '../tools/security/JWTDecoder.vue'
import FileHashCalculator from '../tools/security/FileHashCalculator.vue'
import Base64Encoder from '../tools/conversion/Base64Encoder.vue'
import JSONFormatter from '../tools/conversion/JSONFormatter.vue'
import ColorConverter from '../tools/conversion/ColorConverter.vue'
import TimestampConverter from '../tools/conversion/TimestampConverter.vue'
import URLEncoder from '../tools/conversion/URLEncoder.vue'
import BaseConverter from '../tools/conversion/BaseConverter.vue'
import JSONYAMLConverter from '../tools/conversion/JSONYAMLConverter.vue'
import HTMLEncoder from '../tools/conversion/HTMLEncoder.vue'
import IPSubnetCalculator from '../tools/network/IPSubnetCalculator.vue'
import MACAddressLookup from '../tools/network/MACAddressLookup.vue'
import IPAddressLookup from '../tools/network/IPAddressLookup.vue'
import GitCheatsheet from '../tools/development/GitCheatsheet.vue'
import CronGenerator from '../tools/development/CronGenerator.vue'
import RegexTester from '../tools/development/RegexTester.vue'
import XMLFormatter from '../tools/development/XMLFormatter.vue'
import TextCaseConverter from '../tools/text/TextCaseConverter.vue'
import TextDeduplicator from '../tools/text/TextDeduplicator.vue'
import CharacterCounter from '../tools/text/CharacterCounter.vue'
import ChineseConverter from '../tools/text/ChineseConverter.vue'
import ScientificCalculator from '../tools/math/ScientificCalculator.vue'
import StorageConverter from '../tools/measurement/StorageConverter.vue'
import TimeCalculator from '../tools/measurement/TimeCalculator.vue'
import TextDiff from '../tools/text/TextDiff.vue'
import TextSorter from '../tools/text/TextSorter.vue'
import TextSplitter from '../tools/text/TextSplitter.vue'
import RandomNumberGenerator from '../tools/math/RandomNumberGenerator.vue'
import PrimeChecker from '../tools/math/PrimeChecker.vue'
import VariableConverter from '../tools/development/VariableConverter.vue'
import CodeFormatter from '../tools/development/CodeFormatter.vue'
import VersionComparator from '../tools/development/VersionComparator.vue'
import URLParser from '../tools/web/URLParser.vue'
import UserAgentParser from '../tools/web/UserAgentParser.vue'
import QRCodeGenerator from '../tools/web/QRCodeGenerator.vue'
import CORSTester from '../tools/web/CORSTester.vue'
import PortScanner from '../tools/network/PortScanner.vue'
import ImageBase64 from '../tools/image/ImageBase64.vue'
import PixelConverter from '../tools/measurement/PixelConverter.vue'
import AngleConverter from '../tools/measurement/AngleConverter.vue'
import DataRateConverter from '../tools/measurement/DataRateConverter.vue'
import UnitConverter from '../tools/measurement/UnitConverter.vue'
import GeometryCalculator from '../tools/math/GeometryCalculator.vue'
import LinuxCheatsheet from '../tools/development/LinuxCheatsheet.vue'
import CookieParser from '../tools/web/CookieParser.vue'
import HTTPStatusCodes from '../tools/web/HTTPStatusCodes.vue'
import MetaGenerator from '../tools/web/MetaGenerator.vue'
import CommentGenerator from '../tools/development/CommentGenerator.vue'
import ApiParameterBuilder from '../tools/development/ApiParameterBuilder.vue'
import EnvFormatter from '../tools/development/EnvFormatter.vue'
import SequenceCalculator from '../tools/math/SequenceCalculator.vue'
import ChmodCalculator from '../tools/development/ChmodCalculator.vue'
import LoremIpsumGenerator from '../tools/utility/LoremIpsumGenerator.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/all-tools',
    name: 'AllTools',
    component: AllTools
  },
  {
    path: '/category/:category',
    name: 'Category',
    component: Category
  },
  {
    path: '/tool/token-generator',
    name: 'TokenGenerator',
    component: TokenGenerator
  },
  {
    path: '/tool/hash-text',
    name: 'HashText',
    component: HashText
  },
  {
    path: '/tool/bcrypt',
    name: 'Bcrypt',
    component: Bcrypt
  },
  {
    path: '/tool/uuid-generator',
    name: 'UUIDGenerator',
    component: UUIDGenerator
  },
  {
    path: '/tool/ulid-generator',
    name: 'ULIDGenerator',
    component: ULIDGenerator
  },
  {
    path: '/tool/base64-encoder',
    name: 'Base64Encoder',
    component: Base64Encoder
  },
  {
    path: '/tool/json-formatter',
    name: 'JSONFormatter',
    component: JSONFormatter
  },
  {
    path: '/tool/color-converter',
    name: 'ColorConverter',
    component: ColorConverter
  },
  {
    path: '/tool/ip-subnet-calculator',
    name: 'IPSubnetCalculator',
    component: IPSubnetCalculator
  },
  {
    path: '/tool/mac-address-lookup',
    name: 'MACAddressLookup',
    component: MACAddressLookup
  },
  {
    path: '/tool/git-cheatsheet',
    name: 'GitCheatsheet',
    component: GitCheatsheet
  },
  {
    path: '/tool/cron-generator',
    name: 'CronGenerator',
    component: CronGenerator
  },
  {
    path: '/tool/regex-tester',
    name: 'RegexTester',
    component: RegexTester
  },
  {
    path: '/tool/timestamp-converter',
    name: 'TimestampConverter',
    component: TimestampConverter
  },
  {
    path: '/tool/url-encoder',
    name: 'URLEncoder',
    component: URLEncoder
  },
  {
    path: '/tool/base-converter',
    name: 'BaseConverter',
    component: BaseConverter
  },
  {
    path: '/tool/json-yaml-converter',
    name: 'JSONYAMLConverter',
    component: JSONYAMLConverter
  },
  {
    path: '/tool/password-strength-checker',
    name: 'PasswordStrengthChecker',
    component: PasswordStrengthChecker
  },
  {
    path: '/tool/hash-comparator',
    name: 'HashComparator',
    component: HashComparator
  },
  {
    path: '/tool/jwt-decoder',
    name: 'JWTDecoder',
    component: JWTDecoder
  },
  {
    path: '/tool/file-hash-calculator',
    name: 'FileHashCalculator',
    component: FileHashCalculator
  },
  {
    path: '/tool/html-encoder',
    name: 'HTMLEncoder',
    component: HTMLEncoder
  },
  {
    path: '/tool/ip-address-lookup',
    name: 'IPAddressLookup',
    component: IPAddressLookup
  },
  {
    path: '/tool/xml-formatter',
    name: 'XMLFormatter',
    component: XMLFormatter
  },
  {
    path: '/tool/text-case-converter',
    name: 'TextCaseConverter',
    component: TextCaseConverter
  },
  {
    path: '/tool/text-deduplicator',
    name: 'TextDeduplicator',
    component: TextDeduplicator
  },
  {
    path: '/tool/character-counter',
    name: 'CharacterCounter',
    component: CharacterCounter
  },
  {
    path: '/tool/chinese-converter',
    name: 'ChineseConverter',
    component: ChineseConverter
  },
  {
    path: '/tool/scientific-calculator',
    name: 'ScientificCalculator',
    component: ScientificCalculator
  },
  {
    path: '/tool/storage-converter',
    name: 'StorageConverter',
    component: StorageConverter
  },
  {
    path: '/tool/time-calculator',
    name: 'TimeCalculator',
    component: TimeCalculator
  },
  {
    path: '/tool/text-diff',
    name: 'TextDiff',
    component: TextDiff
  },
  {
    path: '/tool/text-sorter',
    name: 'TextSorter',
    component: TextSorter
  },
  {
    path: '/tool/text-splitter',
    name: 'TextSplitter',
    component: TextSplitter
  },
  {
    path: '/tool/random-number-generator',
    name: 'RandomNumberGenerator',
    component: RandomNumberGenerator
  },
  {
    path: '/tool/prime-checker',
    name: 'PrimeChecker',
    component: PrimeChecker
  },
  {
    path: '/tool/variable-converter',
    name: 'VariableConverter',
    component: VariableConverter
  },
  {
    path: '/tool/code-formatter',
    name: 'CodeFormatter',
    component: CodeFormatter
  },
  {
    path: '/tool/version-comparator',
    name: 'VersionComparator',
    component: VersionComparator
  },
  {
    path: '/tool/url-parser',
    name: 'URLParser',
    component: URLParser
  },
  {
    path: '/tool/user-agent-parser',
    name: 'UserAgentParser',
    component: UserAgentParser
  },
  {
    path: '/tool/qrcode-generator',
    name: 'QRCodeGenerator',
    component: QRCodeGenerator
  },
  {
    path: '/tool/cors-tester',
    name: 'CORSTester',
    component: CORSTester
  },
  {
    path: '/tool/port-scanner',
    name: 'PortScanner',
    component: PortScanner
  },
  {
    path: '/tool/image-base64',
    name: 'ImageBase64',
    component: ImageBase64
  },
  {
    path: '/tool/pixel-converter',
    name: 'PixelConverter',
    component: PixelConverter
  },
  {
    path: '/tool/angle-converter',
    name: 'AngleConverter',
    component: AngleConverter
  },
  {
    path: '/tool/data-rate-converter',
    name: 'DataRateConverter',
    component: DataRateConverter
  },
  {
    path: '/tool/unit-converter',
    name: 'UnitConverter',
    component: UnitConverter
  },
  {
    path: '/tool/geometry-calculator',
    name: 'GeometryCalculator',
    component: GeometryCalculator
  },
  {
    path: '/tool/linux-cheatsheet',
    name: 'LinuxCheatsheet',
    component: LinuxCheatsheet
  },
  {
    path: '/tool/cookie-parser',
    name: 'CookieParser',
    component: CookieParser
  },
  {
    path: '/tool/http-status-codes',
    name: 'HTTPStatusCodes',
    component: HTTPStatusCodes
  },
  {
    path: '/tool/meta-generator',
    name: 'MetaGenerator',
    component: MetaGenerator
  },
  {
    path: '/tool/comment-generator',
    name: 'CommentGenerator',
    component: CommentGenerator
  },
  {
    path: '/tool/api-parameter-builder',
    name: 'ApiParameterBuilder',
    component: ApiParameterBuilder
  },
  {
    path: '/tool/env-formatter',
    name: 'EnvFormatter',
    component: EnvFormatter
  },
  {
    path: '/tool/sequence-calculator',
    name: 'SequenceCalculator',
    component: SequenceCalculator
  },
  {
    path: '/tool/chmod-calculator',
    name: 'ChmodCalculator',
    component: ChmodCalculator
  },
  {
    path: '/tool/lorem-ipsum-generator',
    name: 'LoremIpsumGenerator',
    component: LoremIpsumGenerator
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
