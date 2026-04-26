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
import PasswordGenerator from '../tools/security/PasswordGenerator.vue'
import SensitiveDataScanner from '../tools/security/SensitiveDataScanner.vue'
import Base64Encoder from '../tools/conversion/Base64Encoder.vue'
import JSONFormatter from '../tools/conversion/JSONFormatter.vue'
import ColorConverter from '../tools/conversion/ColorConverter.vue'
import TimestampConverter from '../tools/conversion/TimestampConverter.vue'
import URLEncoder from '../tools/conversion/URLEncoder.vue'
import BaseConverter from '../tools/conversion/BaseConverter.vue'
import JSONYAMLConverter from '../tools/conversion/JSONYAMLConverter.vue'
import HTMLEncoder from '../tools/conversion/HTMLEncoder.vue'
import CharacterEncodingConverter from '../tools/conversion/CharacterEncodingConverter.vue'
import IPSubnetCalculator from '../tools/network/IPSubnetCalculator.vue'
import MACAddressLookup from '../tools/network/MACAddressLookup.vue'
import IPAddressLookup from '../tools/network/IPAddressLookup.vue'
import DNSLookup from '../tools/network/DNSLookup.vue'
import PortScanner from '../tools/network/PortScanner.vue'
import NetworkLatencyTester from '../tools/measurement/NetworkLatencyTester.vue'
import GitCheatsheet from '../tools/development/GitCheatsheet.vue'
import CronGenerator from '../tools/development/CronGenerator.vue'
import RegexTester from '../tools/development/RegexTester.vue'
import RegexGenerator from '../tools/development/RegexGenerator.vue'
import XMLFormatter from '../tools/development/XMLFormatter.vue'
import SQLFormatter from '../tools/development/SQLFormatter.vue'
import YAMLFormatter from '../tools/development/YAMLFormatter.vue'
import JSONSchemaGenerator from '../tools/development/JSONSchemaGenerator.vue'
import JSONPathTester from '../tools/development/JSONPathTester.vue'
import JSONEditor from '../tools/development/JSONEditor.vue'
import MarkdownToHTMLConverter from '../tools/development/MarkdownToHTMLConverter.vue'
import DateTimeFormatter from '../tools/development/DateTimeFormatter.vue'
import JSONSchemaSimplifier from '../tools/development/JSONSchemaSimplifier.vue'
import TextCaseConverter from '../tools/text/TextCaseConverter.vue'
import TextDeduplicator from '../tools/text/TextDeduplicator.vue'
import CharacterCounter from '../tools/text/CharacterCounter.vue'
import ChineseConverter from '../tools/text/ChineseConverter.vue'
import WordFrequencyAnalyzer from '../tools/text/WordFrequencyAnalyzer.vue'
import TextCleaner from '../tools/text/TextCleaner.vue'
import ScientificCalculator from '../tools/math/ScientificCalculator.vue'
import StorageConverter from '../tools/measurement/StorageConverter.vue'
import TimeCalculator from '../tools/measurement/TimeCalculator.vue'
import TextDiff from '../tools/text/TextDiff.vue'
import TextSorter from '../tools/text/TextSorter.vue'
import TextSplitter from '../tools/text/TextSplitter.vue'
import RandomNumberGenerator from '../tools/math/RandomNumberGenerator.vue'
import PrimeChecker from '../tools/math/PrimeChecker.vue'
import StatisticalCalculator from '../tools/math/StatisticalCalculator.vue'
import FunctionGrapher from '../tools/math/FunctionGrapher.vue'
import VariableConverter from '../tools/development/VariableConverter.vue'
import CodeFormatter from '../tools/development/CodeFormatter.vue'
import VersionComparator from '../tools/development/VersionComparator.vue'
import URLParser from '../tools/web/URLParser.vue'
import UserAgentParser from '../tools/web/UserAgentParser.vue'
import QRCodeGenerator from '../tools/web/QRCodeGenerator.vue'
import CORSTester from '../tools/web/CORSTester.vue'
import SSLChecker from '../tools/web/SSLChecker.vue'
import HTTPRequestSimulator from '../tools/web/HTTPRequestSimulator.vue'
import ImageBase64 from '../tools/image/ImageBase64.vue'
import ImageCompressor from '../tools/image/ImageCompressor.vue'
import ImageMetadataExtractor from '../tools/image/ImageMetadataExtractor.vue'
import PixelConverter from '../tools/measurement/PixelConverter.vue'
import AngleConverter from '../tools/measurement/AngleConverter.vue'
import DataRateConverter from '../tools/measurement/DataRateConverter.vue'
import UnitConverter from '../tools/measurement/UnitConverter.vue'
import TimeUnitConverter from '../tools/measurement/TimeUnitConverter.vue'
import ColorContrastAnalyzer from '../tools/measurement/ColorContrastAnalyzer.vue'
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
import APIDocGenerator from '../tools/development/APIDocGenerator.vue'
import ProgressBarGenerator from '../tools/development/ProgressBarGenerator.vue'
import UUIDFormatter from '../tools/development/UUIDFormatter.vue'
import ColorPaletteGenerator from '../tools/development/ColorPaletteGenerator.vue'
import CSSGenerator from '../tools/development/CSSGenerator.vue'
import NumToChineseConverter from '../tools/math/NumToChineseConverter.vue'
import Stopwatch from '../tools/utility/Stopwatch.vue'
import WorldClock from '../tools/utility/WorldClock.vue'
import ASCIIArtGenerator from '../tools/utility/ASCIIArtGenerator.vue'
import SystemInfoViewer from '../tools/utility/SystemInfoViewer.vue'
import FileTypeIdentifier from '../tools/utility/FileTypeIdentifier.vue'
import MultiLanguageCalendar from '../tools/utility/MultiLanguageCalendar.vue'
import CSSGradientGenerator from '../tools/development/CSSGradientGenerator.vue'
import FlexboxGenerator from '../tools/development/FlexboxGenerator.vue'
import TypingSpeedTest from '../tools/text/TypingSpeedTest.vue'
import LoanCalculator from '../tools/math/LoanCalculator.vue'
import BoxShadowGenerator from '../tools/development/BoxShadowGenerator.vue'
import CronInterpreter from '../tools/development/CronInterpreter.vue'
import PercentageCalculator from '../tools/math/PercentageCalculator.vue'
import BMICalculator from '../tools/math/BMICalculator.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/all-tools', name: 'AllTools', component: AllTools },
  { path: '/category/:category', name: 'Category', component: Category },
  { path: '/tool/token-generator', name: 'TokenGenerator', component: TokenGenerator },
  { path: '/tool/hash-text', name: 'HashText', component: HashText },
  { path: '/tool/bcrypt', name: 'Bcrypt', component: Bcrypt },
  { path: '/tool/uuid-generator', name: 'UUIDGenerator', component: UUIDGenerator },
  { path: '/tool/ulid-generator', name: 'ULIDGenerator', component: ULIDGenerator },
  { path: '/tool/password-strength-checker', name: 'PasswordStrengthChecker', component: PasswordStrengthChecker },
  { path: '/tool/hash-comparator', name: 'HashComparator', component: HashComparator },
  { path: '/tool/jwt-decoder', name: 'JWTDecoder', component: JWTDecoder },
  { path: '/tool/file-hash-calculator', name: 'FileHashCalculator', component: FileHashCalculator },
  { path: '/tool/password-generator', name: 'PasswordGenerator', component: PasswordGenerator },
  { path: '/tool/sensitive-data-scanner', name: 'SensitiveDataScanner', component: SensitiveDataScanner },
  { path: '/tool/base64-encoder', name: 'Base64Encoder', component: Base64Encoder },
  { path: '/tool/json-formatter', name: 'JSONFormatter', component: JSONFormatter },
  { path: '/tool/color-converter', name: 'ColorConverter', component: ColorConverter },
  { path: '/tool/timestamp-converter', name: 'TimestampConverter', component: TimestampConverter },
  { path: '/tool/url-encoder', name: 'URLEncoder', component: URLEncoder },
  { path: '/tool/base-converter', name: 'BaseConverter', component: BaseConverter },
  { path: '/tool/json-yaml-converter', name: 'JSONYAMLConverter', component: JSONYAMLConverter },
  { path: '/tool/html-encoder', name: 'HTMLEncoder', component: HTMLEncoder },
  { path: '/tool/character-encoding-converter', name: 'CharacterEncodingConverter', component: CharacterEncodingConverter },
  { path: '/tool/ip-subnet-calculator', name: 'IPSubnetCalculator', component: IPSubnetCalculator },
  { path: '/tool/mac-address-lookup', name: 'MACAddressLookup', component: MACAddressLookup },
  { path: '/tool/ip-address-lookup', name: 'IPAddressLookup', component: IPAddressLookup },
  { path: '/tool/dns-lookup', name: 'DNSLookup', component: DNSLookup },
  { path: '/tool/port-scanner', name: 'PortScanner', component: PortScanner },
  { path: '/tool/network-latency-tester', name: 'NetworkLatencyTester', component: NetworkLatencyTester },
  { path: '/tool/git-cheatsheet', name: 'GitCheatsheet', component: GitCheatsheet },
  { path: '/tool/cron-generator', name: 'CronGenerator', component: CronGenerator },
  { path: '/tool/regex-tester', name: 'RegexTester', component: RegexTester },
  { path: '/tool/regex-generator', name: 'RegexGenerator', component: RegexGenerator },
  { path: '/tool/xml-formatter', name: 'XMLFormatter', component: XMLFormatter },
  { path: '/tool/sql-formatter', name: 'SQLFormatter', component: SQLFormatter },
  { path: '/tool/yaml-formatter', name: 'YAMLFormatter', component: YAMLFormatter },
  { path: '/tool/json-schema-generator', name: 'JSONSchemaGenerator', component: JSONSchemaGenerator },
  { path: '/tool/json-path-tester', name: 'JSONPathTester', component: JSONPathTester },
  { path: '/tool/json-editor', name: 'JSONEditor', component: JSONEditor },
  { path: '/tool/markdown-to-html-converter', name: 'MarkdownToHTMLConverter', component: MarkdownToHTMLConverter },
  { path: '/tool/datetime-formatter', name: 'DateTimeFormatter', component: DateTimeFormatter },
  { path: '/tool/json-schema-simplifier', name: 'JSONSchemaSimplifier', component: JSONSchemaSimplifier },
  { path: '/tool/variable-converter', name: 'VariableConverter', component: VariableConverter },
  { path: '/tool/code-formatter', name: 'CodeFormatter', component: CodeFormatter },
  { path: '/tool/version-comparator', name: 'VersionComparator', component: VersionComparator },
  { path: '/tool/linux-cheatsheet', name: 'LinuxCheatsheet', component: LinuxCheatsheet },
  { path: '/tool/comment-generator', name: 'CommentGenerator', component: CommentGenerator },
  { path: '/tool/api-parameter-builder', name: 'ApiParameterBuilder', component: ApiParameterBuilder },
  { path: '/tool/api-doc-generator', name: 'APIDocGenerator', component: APIDocGenerator },
  { path: '/tool/env-formatter', name: 'EnvFormatter', component: EnvFormatter },
  { path: '/tool/chmod-calculator', name: 'ChmodCalculator', component: ChmodCalculator },
  { path: '/tool/progress-bar-generator', name: 'ProgressBarGenerator', component: ProgressBarGenerator },
  { path: '/tool/uuid-formatter', name: 'UUIDFormatter', component: UUIDFormatter },
  { path: '/tool/color-palette-generator', name: 'ColorPaletteGenerator', component: ColorPaletteGenerator },
  { path: '/tool/css-generator', name: 'CSSGenerator', component: CSSGenerator },
  { path: '/tool/url-parser', name: 'URLParser', component: URLParser },
  { path: '/tool/user-agent-parser', name: 'UserAgentParser', component: UserAgentParser },
  { path: '/tool/qrcode-generator', name: 'QRCodeGenerator', component: QRCodeGenerator },
  { path: '/tool/cors-tester', name: 'CORSTester', component: CORSTester },
  { path: '/tool/ssl-checker', name: 'SSLChecker', component: SSLChecker },
  { path: '/tool/http-request-simulator', name: 'HTTPRequestSimulator', component: HTTPRequestSimulator },
  { path: '/tool/cookie-parser', name: 'CookieParser', component: CookieParser },
  { path: '/tool/http-status-codes', name: 'HTTPStatusCodes', component: HTTPStatusCodes },
  { path: '/tool/meta-generator', name: 'MetaGenerator', component: MetaGenerator },
  { path: '/tool/text-case-converter', name: 'TextCaseConverter', component: TextCaseConverter },
  { path: '/tool/text-deduplicator', name: 'TextDeduplicator', component: TextDeduplicator },
  { path: '/tool/character-counter', name: 'CharacterCounter', component: CharacterCounter },
  { path: '/tool/text-diff', name: 'TextDiff', component: TextDiff },
  { path: '/tool/text-sorter', name: 'TextSorter', component: TextSorter },
  { path: '/tool/text-splitter', name: 'TextSplitter', component: TextSplitter },
  { path: '/tool/word-frequency-analyzer', name: 'WordFrequencyAnalyzer', component: WordFrequencyAnalyzer },
  { path: '/tool/text-cleaner', name: 'TextCleaner', component: TextCleaner },
  { path: '/tool/scientific-calculator', name: 'ScientificCalculator', component: ScientificCalculator },
  { path: '/tool/random-number-generator', name: 'RandomNumberGenerator', component: RandomNumberGenerator },
  { path: '/tool/prime-checker', name: 'PrimeChecker', component: PrimeChecker },
  { path: '/tool/geometry-calculator', name: 'GeometryCalculator', component: GeometryCalculator },
  { path: '/tool/sequence-calculator', name: 'SequenceCalculator', component: SequenceCalculator },
  { path: '/tool/num-to-chinese', name: 'NumToChineseConverter', component: NumToChineseConverter },
  { path: '/tool/statistical-calculator', name: 'StatisticalCalculator', component: StatisticalCalculator },
  { path: '/tool/function-grapher', name: 'FunctionGrapher', component: FunctionGrapher },
  { path: '/tool/storage-converter', name: 'StorageConverter', component: StorageConverter },
  { path: '/tool/time-calculator', name: 'TimeCalculator', component: TimeCalculator },
  { path: '/tool/time-unit-converter', name: 'TimeUnitConverter', component: TimeUnitConverter },
  { path: '/tool/pixel-converter', name: 'PixelConverter', component: PixelConverter },
  { path: '/tool/angle-converter', name: 'AngleConverter', component: AngleConverter },
  { path: '/tool/data-rate-converter', name: 'DataRateConverter', component: DataRateConverter },
  { path: '/tool/unit-converter', name: 'UnitConverter', component: UnitConverter },
  { path: '/tool/color-contrast-analyzer', name: 'ColorContrastAnalyzer', component: ColorContrastAnalyzer },
  { path: '/tool/image-base64', name: 'ImageBase64', component: ImageBase64 },
  { path: '/tool/image-compressor', name: 'ImageCompressor', component: ImageCompressor },
  { path: '/tool/image-metadata-extractor', name: 'ImageMetadataExtractor', component: ImageMetadataExtractor },
  { path: '/tool/lorem-ipsum-generator', name: 'LoremIpsumGenerator', component: LoremIpsumGenerator },
  { path: '/tool/stopwatch', name: 'Stopwatch', component: Stopwatch },
  { path: '/tool/world-clock', name: 'WorldClock', component: WorldClock },
  { path: '/tool/ascii-art-generator', name: 'ASCIIArtGenerator', component: ASCIIArtGenerator },
  { path: '/tool/system-info-viewer', name: 'SystemInfoViewer', component: SystemInfoViewer },
  { path: '/tool/file-type-identifier', name: 'FileTypeIdentifier', component: FileTypeIdentifier },
  { path: '/tool/multi-language-calendar', name: 'MultiLanguageCalendar', component: MultiLanguageCalendar },
  { path: '/tool/css-gradient-generator', name: 'CSSGradientGenerator', component: CSSGradientGenerator },
  { path: '/tool/flexbox-generator', name: 'FlexboxGenerator', component: FlexboxGenerator },
  { path: '/tool/typing-speed-test', name: 'TypingSpeedTest', component: TypingSpeedTest },
  { path: '/tool/loan-calculator', name: 'LoanCalculator', component: LoanCalculator },
  { path: '/tool/box-shadow-generator', name: 'BoxShadowGenerator', component: BoxShadowGenerator },
  { path: '/tool/cron-interpreter', name: 'CronInterpreter', component: CronInterpreter },
  { path: '/tool/percentage-calculator', name: 'PercentageCalculator', component: PercentageCalculator },
  { path: '/tool/bmi-calculator', name: 'BMICalculator', component: BMICalculator }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
