export type ResourceType = 'video' | 'article' | 'book' | 'practice' | 'doc';

export type LearningResourceEntry = {
  skillId: string;
  skillName: string;
  aliases: string[];
  category: string;
  description: string;
  difficulty: '入门' | '简单' | '中等' | '较难' | '困难';
  estimatedTime: string;
  prerequisites: string[];
  relatedSkills: string[];
  learningPath: {
    phase: string;
    goal: string;
    resources: {
      type: ResourceType;
      title: string;
      url: string;
      description: string;
      level: '入门' | '进阶' | '高级';
      free: boolean;
    }[];
  }[];
};

export const LEARNING_RESOURCE_DB: LearningResourceEntry[] = [
  // ========== 编程语言类 ==========
  {
    skillId: 'python',
    skillName: 'Python',
    aliases: ['python', '派森', '爬虫', '数据分析', 'AI编程', '自动化脚本', '机器学习入门', '蟒蛇', 'py'],
    category: '编程语言',
    description: '最流行的通用编程语言，适合数据分析、AI、Web开发',
    difficulty: '简单',
    estimatedTime: '2-4个月',
    prerequisites: [],
    relatedSkills: ['javascript', 'data-analysis', 'machine-learning', 'pandas'],
    learningPath: [
      {
        phase: '基础语法',
        goal: '掌握Python基础语法、数据类型与流程控制',
        resources: [
          { type: 'doc', title: 'Python官方教程', url: 'https://docs.python.org/zh-cn/3/tutorial/', description: 'Python官方中文教程，权威入门资料', level: '入门', free: true },
          { type: 'article', title: '菜鸟教程 Python', url: 'https://www.runoob.com/python/python-tutorial.html', description: '适合零基础新手的Python教程', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶应用',
        goal: '掌握面向对象、文件操作、常用标准库与异常处理',
        resources: [
          { type: 'book', title: 'Python Cookbook', url: 'https://python3-cookbook.readthedocs.io/zh_CN/latest/', description: 'Python进阶技巧与实用配方', level: '进阶', free: true },
          { type: 'practice', title: 'LeetCode Python题库', url: 'https://leetcode.cn/problemset/all/', description: '通过刷题提升Python编程能力', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'javascript',
    skillName: 'JavaScript',
    aliases: ['javascript', 'js', 'ECMAScript', '前端脚本', '网页交互', 'ES6', 'web脚本语言'],
    category: '编程语言',
    description: 'Web前端必备语言，也可用于后端和移动端',
    difficulty: '简单',
    estimatedTime: '2-3个月',
    prerequisites: [],
    relatedSkills: ['typescript', 'html-css', 'react', 'vue', 'nodejs'],
    learningPath: [
      {
        phase: '语法基础',
        goal: '掌握变量、函数、作用域、DOM操作',
        resources: [
          { type: 'doc', title: 'MDN JavaScript指南', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide', description: 'Mozilla官方JS权威文档', level: '入门', free: true },
          { type: 'article', title: '菜鸟教程 JavaScript', url: 'https://www.runoob.com/js/js-tutorial.html', description: 'JavaScript入门教程', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶特性',
        goal: '掌握ES6+、异步编程、模块化',
        resources: [
          { type: 'doc', title: '现代JavaScript教程', url: 'https://zh.javascript.info/', description: '从基础到进阶的完整JS教程', level: '进阶', free: true },
          { type: 'practice', title: 'Codewars JS练习', url: 'https://www.codewars.com/kata/search/javascript', description: '通过练习题提升JS能力', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'typescript',
    skillName: 'TypeScript',
    aliases: ['typescript', 'ts', 'JS超集', '类型JS', '静态类型JS'],
    category: '编程语言',
    description: 'JavaScript的超集，增加类型系统',
    difficulty: '中等',
    estimatedTime: '1-2个月',
    prerequisites: ['javascript'],
    relatedSkills: ['javascript', 'react', 'nestjs', 'nextjs'],
    learningPath: [
      {
        phase: '类型基础',
        goal: '掌握类型注解、接口、泛型',
        resources: [
          { type: 'doc', title: 'TypeScript官方文档', url: 'https://www.typescriptlang.org/zh/docs/', description: 'TS官方中文文档', level: '入门', free: true },
          { type: 'article', title: 'TypeScript入门教程', url: 'https://ts.xcatliu.com/', description: '中文TS入门教程，通俗易懂', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶类型',
        goal: '掌握高级类型、装饰器、工程配置',
        resources: [
          { type: 'practice', title: 'TypeScript Exercises', url: 'https://typescript-exercises.github.io/', description: '在线TS类型练习题', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'java',
    skillName: 'Java',
    aliases: ['java', '爪哇', 'JVM', '企业开发', 'Spring入门', '面向对象', 'JDK'],
    category: '编程语言',
    description: '企业级开发首选，稳定可靠',
    difficulty: '中等',
    estimatedTime: '3-6个月',
    prerequisites: [],
    relatedSkills: ['spring', 'kotlin', 'algorithms', 'mysql'],
    learningPath: [
      {
        phase: '核心语法',
        goal: '掌握Java语法、面向对象、集合框架',
        resources: [
          { type: 'doc', title: '菜鸟教程 Java', url: 'https://www.runoob.com/java/java-tutorial.html', description: 'Java基础入门教程', level: '入门', free: true },
          { type: 'book', title: 'Java核心技术', url: 'https://book.douban.com/subject/26880667/', description: '经典Java入门书籍', level: '入门', free: false },
        ],
      },
      {
        phase: '进阶开发',
        goal: '掌握IO、多线程、JVM、网络编程',
        resources: [
          { type: 'practice', title: 'LeetCode Java题库', url: 'https://leetcode.cn/problemset/all/', description: 'Java刷题练习', level: '进阶', free: true },
          { type: 'book', title: '深入理解Java虚拟机', url: 'https://book.douban.com/subject/34907491/', description: 'JVM原理经典书籍', level: '高级', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'go',
    skillName: 'Go',
    aliases: ['go', 'golang', 'go语言', '云原生语言', '高性能后端', '谷歌语言'],
    category: '编程语言',
    description: '高性能后端开发语言，云原生首选',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: [],
    relatedSkills: ['gin', 'microservices', 'kubernetes', 'docker'],
    learningPath: [
      {
        phase: '语言基础',
        goal: '掌握Go语法、goroutine、channel',
        resources: [
          { type: 'doc', title: 'Go官方教程', url: 'https://tour.go-zh.org/', description: 'Go官方交互式教程', level: '入门', free: true },
          { type: 'doc', title: 'Go语言圣经(中文版)', url: 'https://gopl-zh.github.io/', description: 'The Go Programming Language中文版', level: '进阶', free: true },
        ],
      },
      {
        phase: '工程实践',
        goal: '掌握Go项目结构、测试与并发编程',
        resources: [
          { type: 'doc', title: 'Effective Go', url: 'https://go.dev/doc/effective_go', description: 'Go高效编程最佳实践', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'rust',
    skillName: 'Rust',
    aliases: ['rust', 'rust语言', '铁锈', '内存安全', '系统编程', '所有权', '无GC语言'],
    category: '编程语言',
    description: '内存安全的系统编程语言',
    difficulty: '困难',
    estimatedTime: '4-8个月',
    prerequisites: [],
    relatedSkills: ['cpp', 'c-lang', 'system-design'],
    learningPath: [
      {
        phase: '所有权与基础',
        goal: '掌握所有权、借用、生命周期',
        resources: [
          { type: 'doc', title: 'Rust程序设计语言(中文)', url: 'https://rustwiki.org/zh-CN/book/', description: 'The Rust Book官方中文版', level: '入门', free: true },
          { type: 'practice', title: 'Rustlings练习', url: 'https://github.com/rust-lang/rustlings', description: '官方交互式练习题', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶开发',
        goal: '掌握trait、泛型、异步与宏',
        resources: [
          { type: 'doc', title: 'Rust by Example', url: 'https://rustwiki.org/zh-CN/rust-by-example/', description: '通过示例学习Rust', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'cpp',
    skillName: 'C++',
    aliases: ['cpp', 'c++', 'C Plus Plus', 'C加加', '游戏引擎', '高性能', 'STL'],
    category: '编程语言',
    description: '高性能系统开发，游戏引擎首选',
    difficulty: '较难',
    estimatedTime: '4-8个月',
    prerequisites: [],
    relatedSkills: ['c-lang', 'unity', 'unreal', 'algorithms'],
    learningPath: [
      {
        phase: '基础语法',
        goal: '掌握C++语法、指针、引用、类',
        resources: [
          { type: 'article', title: '菜鸟教程 C++', url: 'https://www.runoob.com/cplusplus/cpp-tutorial.html', description: 'C++基础入门教程', level: '入门', free: true },
          { type: 'doc', title: 'cppreference', url: 'https://zh.cppreference.com/w/%E9%A6%96%E9%A1%B5', description: 'C++标准库权威参考', level: '进阶', free: true },
        ],
      },
      {
        phase: '进阶特性',
        goal: '掌握STL、模板、智能指针、并发',
        resources: [
          { type: 'book', title: 'Effective C++', url: 'https://book.douban.com/subject/5387401/', description: 'C++最佳实践经典', level: '高级', free: false },
          { type: 'practice', title: 'LeetCode C++题库', url: 'https://leetcode.cn/problemset/all/', description: 'STL与算法刷题', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'csharp',
    skillName: 'C#',
    aliases: ['csharp', 'c#', 'C Sharp', 'dotnet', '微软语言', 'Unity脚本', '.NET'],
    category: '编程语言',
    description: '微软生态主力语言，Unity游戏开发',
    difficulty: '中等',
    estimatedTime: '3-5个月',
    prerequisites: [],
    relatedSkills: ['unity', 'dotnet', 'algorithms'],
    learningPath: [
      {
        phase: '语言基础',
        goal: '掌握C#语法、面向对象、LINQ',
        resources: [
          { type: 'doc', title: 'C#官方文档', url: 'https://learn.microsoft.com/zh-cn/dotnet/csharp/', description: '微软C#官方教程', level: '入门', free: true },
          { type: 'article', title: '菜鸟教程 C#', url: 'https://www.runoob.com/csharp/csharp-tutorial.html', description: 'C#基础入门', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶开发',
        goal: '掌握异步、委托、.NET生态',
        resources: [
          { type: 'doc', title: '.NET文档', url: 'https://learn.microsoft.com/zh-cn/dotnet/', description: '.NET平台完整文档', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'php',
    skillName: 'PHP',
    aliases: ['php', '超文本预处理器', 'WordPress', 'Laravel', 'Web后端', '动态网页'],
    category: '编程语言',
    description: 'Web开发老牌语言，WordPress生态',
    difficulty: '简单',
    estimatedTime: '1-3个月',
    prerequisites: [],
    relatedSkills: ['javascript', 'mysql', 'html-css'],
    learningPath: [
      {
        phase: '语法基础',
        goal: '掌握PHP语法、表单处理、数据库连接',
        resources: [
          { type: 'doc', title: 'PHP官方手册', url: 'https://www.php.net/manual/zh/', description: 'PHP官方中文手册', level: '入门', free: true },
          { type: 'article', title: '菜鸟教程 PHP', url: 'https://www.runoob.com/php/php-tutorial.html', description: 'PHP入门教程', level: '入门', free: true },
        ],
      },
      {
        phase: '框架实战',
        goal: '掌握Laravel等现代PHP框架',
        resources: [
          { type: 'doc', title: 'Laravel中文文档', url: 'https://learnku.com/docs/laravel/10.x', description: 'Laravel框架文档', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'ruby',
    skillName: 'Ruby',
    aliases: ['ruby', '红宝石', 'Rails', 'Ruby on Rails', 'DSL', '动态语言'],
    category: '编程语言',
    description: '优雅的脚本语言，Ruby on Rails框架',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: [],
    relatedSkills: ['javascript', 'python', 'rest-api'],
    learningPath: [
      {
        phase: '基础语法',
        goal: '掌握Ruby语法、块、模块',
        resources: [
          { type: 'doc', title: 'Ruby官方文档', url: 'https://www.ruby-lang.org/zh_cn/documentation/', description: 'Ruby官方中文文档', level: '入门', free: true },
          { type: 'book', title: 'Ruby编程入门', url: 'https://www.ruby-lang.org/zh_cn/documentation/quickstart/', description: 'Ruby快速入门指南', level: '入门', free: true },
        ],
      },
      {
        phase: 'Rails框架',
        goal: '掌握Ruby on Rails全栈开发',
        resources: [
          { type: 'doc', title: 'Ruby on Rails指南', url: 'https://ruby-china.github.io/rails-guides/', description: 'Rails官方中文指南', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'swift-lang',
    skillName: 'Swift',
    aliases: ['swift', 'swift语言', '苹果开发', 'iOS开发', 'SwiftUI', 'Objective-C替代'],
    category: '编程语言',
    description: 'Apple生态开发语言，iOS/macOS首选',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: [],
    relatedSkills: ['ios-dev', 'swift-ui', 'objective-c'],
    learningPath: [
      {
        phase: '语言基础',
        goal: '掌握Swift语法、可选值、闭包',
        resources: [
          { type: 'doc', title: 'Swift官方教程(中文)', url: 'https://www.runoob.com/swift/swift-tutorial.html', description: 'Swift基础入门', level: '入门', free: true },
          { type: 'doc', title: 'Swift.org官方文档', url: 'https://www.swift.org/documentation/', description: 'Swift官方文档', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶开发',
        goal: '掌握协议、泛型、并发编程',
        resources: [
          { type: 'doc', title: '苹果开发者文档', url: 'https://developer.apple.com/swift/resources/', description: 'Apple官方Swift资源', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'kotlin',
    skillName: 'Kotlin',
    aliases: ['kotlin', 'kot', 'Android官方语言', 'JVM语言', '协程', 'JetBrains'],
    category: '编程语言',
    description: 'Android官方开发语言，JVM生态',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: [],
    relatedSkills: ['java', 'android-dev', 'jetpack'],
    learningPath: [
      {
        phase: '语言基础',
        goal: '掌握Kotlin语法、空安全、扩展函数',
        resources: [
          { type: 'doc', title: 'Kotlin官方文档(中文)', url: 'https://www.kotlincn.net/docs/reference/', description: 'Kotlin官方中文文档', level: '入门', free: true },
          { type: 'practice', title: 'Kotlin Koans', url: 'https://play.kotlinlang.org/koans/overview', description: '官方交互式练习', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶应用',
        goal: '掌握协程、Android开发实战',
        resources: [
          { type: 'doc', title: 'Android Kotlin指南', url: 'https://developer.android.com/kotlin?hl=zh-cn', description: 'Android官方Kotlin指南', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'r-lang',
    skillName: 'R语言',
    aliases: ['r', 'r语言', '统计分析', '数据科学', 'ggplot2', 'RStudio', '生物统计'],
    category: '编程语言',
    description: '统计分析和数据科学专用语言',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: [],
    relatedSkills: ['python', 'data-analysis', 'data-visualization', 'math-stats'],
    learningPath: [
      {
        phase: '基础语法',
        goal: '掌握R语法、数据框、绘图',
        resources: [
          { type: 'doc', title: 'R语言教程', url: 'https://www.runoob.com/r/r-tutorial.html', description: 'R语言入门教程', level: '入门', free: true },
          { type: 'book', title: 'R for Data Science', url: 'https://r4ds.had.co.nz/', description: 'R语言数据科学经典', level: '入门', free: true },
        ],
      },
      {
        phase: '统计分析',
        goal: '掌握统计建模、可视化与报告生成',
        resources: [
          { type: 'doc', title: 'ggplot2文档', url: 'https://ggplot2-book.org/', description: 'R可视化库ggplot2教程', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'scala',
    skillName: 'Scala',
    aliases: ['scala', '可扩展语言', '函数式编程', 'Spark', 'JVM函数式', 'Akka'],
    category: '编程语言',
    description: 'JVM上的函数式编程语言，大数据方向',
    difficulty: '较难',
    estimatedTime: '3-6个月',
    prerequisites: [],
    relatedSkills: ['java', 'kafka', 'etl'],
    learningPath: [
      {
        phase: '语言基础',
        goal: '掌握Scala语法、模式匹配、集合',
        resources: [
          { type: 'doc', title: 'Scala官方文档', url: 'https://docs.scala-lang.org/zh-cn/', description: 'Scala官方中文文档', level: '入门', free: true },
          { type: 'book', title: 'Scala教程', url: 'https://www.runoob.com/scala/scala-tutorial.html', description: 'Scala入门教程', level: '入门', free: true },
        ],
      },
      {
        phase: '大数据应用',
        goal: '掌握Spark大数据开发',
        resources: [
          { type: 'doc', title: 'Spark官方文档', url: 'https://spark.apache.org/docs/latest/', description: 'Apache Spark文档', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'c-lang',
    skillName: 'C语言',
    aliases: ['c', 'c语言', '底层编程', '嵌入式', '指针', '系统编程基础', 'K&R'],
    category: '编程语言',
    description: '系统编程基础，嵌入式开发必备',
    difficulty: '较难',
    estimatedTime: '3-6个月',
    prerequisites: [],
    relatedSkills: ['cpp', 'embedded', 'operating-systems', 'computer-architecture'],
    learningPath: [
      {
        phase: '基础语法',
        goal: '掌握C语法、指针、内存管理',
        resources: [
          { type: 'article', title: '菜鸟教程 C语言', url: 'https://www.runoob.com/cprogramming/c-tutorial.html', description: 'C语言入门教程', level: '入门', free: true },
          { type: 'book', title: 'C程序设计语言', url: 'https://book.douban.com/subject/1139336/', description: 'K&R经典C语言书籍', level: '入门', free: false },
        ],
      },
      {
        phase: '进阶编程',
        goal: '掌握文件操作、预处理、数据结构',
        resources: [
          { type: 'practice', title: 'LeetCode C题库', url: 'https://leetcode.cn/problemset/all/', description: 'C语言刷题练习', level: '进阶', free: true },
        ],
      },
    ],
  },

  // ========== 前端开发类 ==========
  {
    skillId: 'html-css',
    skillName: 'HTML/CSS',
    aliases: ['html', 'css', '网页制作', '前端基础', 'HTML5', 'CSS3', '响应式布局', 'Flexbox'],
    category: '前端开发',
    description: '网页结构和样式基础',
    difficulty: '入门',
    estimatedTime: '2-4周',
    prerequisites: [],
    relatedSkills: ['javascript', 'react', 'vue', 'sass'],
    learningPath: [
      {
        phase: 'HTML与CSS基础',
        goal: '掌握标签语义化与样式布局',
        resources: [
          { type: 'doc', title: 'MDN Web入门', url: 'https://developer.mozilla.org/zh-CN/docs/Learn/Getting_started_with_the_web', description: 'MDN前端入门教程', level: '入门', free: true },
          { type: 'article', title: '菜鸟教程 HTML', url: 'https://www.runoob.com/html/html-tutorial.html', description: 'HTML基础教程', level: '入门', free: true },
        ],
      },
      {
        phase: '布局与响应式',
        goal: '掌握Flexbox、Grid、响应式设计',
        resources: [
          { type: 'doc', title: 'Flexbox教程', url: 'https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html', description: '阮一峰Flex布局教程', level: '进阶', free: true },
          { type: 'practice', title: 'Flexbox Froggy', url: 'https://flexboxfroggy.com/#zh-cn', description: '游戏化学习Flex布局', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'react',
    skillName: 'React',
    aliases: ['react', 'reactjs', 'React.js', 'JSX', 'hooks', '虚拟DOM', '前端框架', 'Fiber'],
    category: '前端开发',
    description: '最流行的前端框架',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: ['javascript', 'html-css'],
    relatedSkills: ['nextjs', 'react-native', 'redux'],
    learningPath: [
      {
        phase: '核心概念',
        goal: '掌握组件、Props、State、Hooks',
        resources: [
          { type: 'doc', title: 'React官方文档(中文)', url: 'https://zh-hans.react.dev/learn', description: 'React新版官方教程', level: '入门', free: true },
          { type: 'article', title: 'React教程', url: 'https://www.runoob.com/react/react-tutorial.html', description: '菜鸟React入门', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶实战',
        goal: '掌握状态管理、路由、性能优化',
        resources: [
          { type: 'doc', title: 'Redux中文文档', url: 'https://cn.redux.js.org/', description: 'Redux状态管理教程', level: '进阶', free: true },
          { type: 'practice', title: 'React练习项目', url: 'https://github.com/ascoders/weekly', description: 'React源码与进阶学习', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'vue',
    skillName: 'Vue',
    aliases: ['vue', 'vuejs', 'Vue.js', '渐进式框架', 'Vue3', 'Composition API', '响应式'],
    category: '前端开发',
    description: '渐进式JavaScript框架',
    difficulty: '简单',
    estimatedTime: '1-3个月',
    prerequisites: ['javascript', 'html-css'],
    relatedSkills: ['react', 'javascript', 'nuxt'],
    learningPath: [
      {
        phase: '基础入门',
        goal: '掌握模板语法、指令、组件',
        resources: [
          { type: 'doc', title: 'Vue官方文档', url: 'https://cn.vuejs.org/guide/introduction.html', description: 'Vue3官方中文文档', level: '入门', free: true },
          { type: 'article', title: '菜鸟教程 Vue', url: 'https://www.runoob.com/vue3/vue3-tutorial.html', description: 'Vue3入门教程', level: '入门', free: true },
        ],
      },
      {
        phase: '生态进阶',
        goal: '掌握Vue Router、Pinia、组合式API',
        resources: [
          { type: 'doc', title: 'Vue Router文档', url: 'https://router.vuejs.org/zh/', description: 'Vue官方路由库', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'angular',
    skillName: 'Angular',
    aliases: ['angular', 'angularjs', 'Angular2', 'TypeScript框架', 'RxJS', '企业前端'],
    category: '前端开发',
    description: '企业级前端框架',
    difficulty: '较难',
    estimatedTime: '3-5个月',
    prerequisites: ['typescript', 'javascript'],
    relatedSkills: ['typescript', 'react', 'rxjs'],
    learningPath: [
      {
        phase: '核心概念',
        goal: '掌握组件、模块、依赖注入',
        resources: [
          { type: 'doc', title: 'Angular官方文档', url: 'https://angular.cn/docs', description: 'Angular官方中文文档', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶开发',
        goal: '掌握RxJS、表单、路由',
        resources: [
          { type: 'doc', title: 'RxJS文档', url: 'https://rxjs.dev/guide/overview', description: '响应式编程库文档', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'nextjs',
    skillName: 'Next.js',
    aliases: ['nextjs', 'next.js', 'NextJS', 'React SSR', '全栈React', 'App Router'],
    category: '前端开发',
    description: 'React全栈框架，SSR支持',
    difficulty: '中等',
    estimatedTime: '1-3个月',
    prerequisites: ['react', 'javascript'],
    relatedSkills: ['react', 'nodejs', 'typescript'],
    learningPath: [
      {
        phase: '基础入门',
        goal: '掌握路由、页面、数据获取',
        resources: [
          { type: 'doc', title: 'Next.js官方文档', url: 'https://nextjs.org/docs', description: 'Next.js官方文档', level: '入门', free: true },
          { type: 'article', title: 'Next.js中文教程', url: 'https://nextjs.org/docs', description: 'Next.js学习手册', level: '入门', free: true },
        ],
      },
      {
        phase: '全栈实战',
        goal: '掌握API路由、SSR/SSG、部署',
        resources: [
          { type: 'practice', title: 'Next.js示例项目', url: 'https://github.com/vercel/next.js/tree/canary/examples', description: '官方示例集合', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'tailwind',
    skillName: 'Tailwind CSS',
    aliases: ['tailwind', 'tailwindcss', '原子化CSS', 'utility-first', 'TailwindCSS'],
    category: '前端开发',
    description: '实用优先的CSS框架',
    difficulty: '简单',
    estimatedTime: '1-2周',
    prerequisites: ['html-css'],
    relatedSkills: ['html-css', 'react', 'vue'],
    learningPath: [
      {
        phase: '基础使用',
        goal: '掌握工具类与响应式设计',
        resources: [
          { type: 'doc', title: 'Tailwind官方文档', url: 'https://tailwindcss.com/docs', description: 'Tailwind官方文档', level: '入门', free: true },
          { type: 'practice', title: 'Tailwind练习', url: 'https://tailwindcss.com/docs/installation', description: '官方安装与配置指南', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶定制',
        goal: '掌握主题配置、插件、组件抽象',
        resources: [
          { type: 'article', title: 'Tailwind最佳实践', url: 'https://tailwindcss.com/docs/reusing-styles', description: '样式复用指南', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'svelte',
    skillName: 'Svelte',
    aliases: ['svelte', 'SvelteKit', '编译框架', '无虚拟DOM', '轻量框架'],
    category: '前端开发',
    description: '编译时框架，无虚拟DOM高性能',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: ['javascript', 'html-css'],
    relatedSkills: ['react', 'vue', 'javascript'],
    learningPath: [
      {
        phase: '基础入门',
        goal: '掌握Svelte语法与响应式',
        resources: [
          { type: 'doc', title: 'Svelte官方教程', url: 'https://learn.svelte.dev/', description: 'Svelte官方交互教程', level: '入门', free: true },
          { type: 'doc', title: 'Svelte中文文档', url: 'https://www.svelte.cn/', description: 'Svelte中文站点', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'sass',
    skillName: 'Sass/Less',
    aliases: ['sass', 'scss', 'less', 'CSS预处理器', 'CSS扩展'],
    category: '前端开发',
    description: 'CSS预处理器，增强样式编写',
    difficulty: '简单',
    estimatedTime: '1-2周',
    prerequisites: ['html-css'],
    relatedSkills: ['html-css', 'tailwind'],
    learningPath: [
      {
        phase: '基础语法',
        goal: '掌握变量、嵌套、混入、继承',
        resources: [
          { type: 'doc', title: 'Sass官方文档', url: 'https://sass-lang.com/documentation', description: 'Sass官方文档', level: '入门', free: true },
          { type: 'article', title: '菜鸟教程 Sass', url: 'https://www.runoob.com/sass/sass-tutorial.html', description: 'Sass入门教程', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'webpack',
    skillName: 'Webpack/Vite',
    aliases: ['webpack', 'vite', '前端构建', '打包工具', '模块打包', '构建工具'],
    category: '前端开发',
    description: '前端构建打包工具',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: ['javascript', 'nodejs'],
    relatedSkills: ['react', 'vue', 'nodejs'],
    learningPath: [
      {
        phase: '基础配置',
        goal: '掌握入口、输出、Loader、Plugin',
        resources: [
          { type: 'doc', title: 'Webpack官方文档', url: 'https://webpack.docschina.org/concepts/', description: 'Webpack中文文档', level: '入门', free: true },
          { type: 'doc', title: 'Vite官方文档', url: 'https://cn.vitejs.dev/guide/', description: 'Vite新一代构建工具', level: '入门', free: true },
        ],
      },
      {
        phase: '优化实战',
        goal: '掌握代码分割、性能优化',
        resources: [
          { type: 'article', title: 'Webpack优化指南', url: 'https://webpack.docschina.org/guides/', description: 'Webpack指南', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'svg-canvas',
    skillName: 'SVG/Canvas',
    aliases: ['svg', 'canvas', '矢量图形', '绘图', 'Web图形', 'D3', 'WebGL基础'],
    category: '前端开发',
    description: '网页图形和动画开发',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: ['javascript', 'html-css'],
    relatedSkills: ['data-visualization', 'shader'],
    learningPath: [
      {
        phase: 'SVG与Canvas基础',
        goal: '掌握矢量图与位图绘制',
        resources: [
          { type: 'doc', title: 'MDN SVG教程', url: 'https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial', description: 'MDN SVG教程', level: '入门', free: true },
          { type: 'doc', title: 'MDN Canvas教程', url: 'https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial', description: 'Canvas绘图教程', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'pwa',
    skillName: 'PWA',
    aliases: ['pwa', '渐进式Web应用', 'Service Worker', '离线应用', 'Web App Manifest'],
    category: '前端开发',
    description: '渐进式Web应用，离线可用',
    difficulty: '较难',
    estimatedTime: '2-4周',
    prerequisites: ['javascript', 'html-css'],
    relatedSkills: ['javascript', 'mini-program'],
    learningPath: [
      {
        phase: 'PWA核心',
        goal: '掌握Service Worker、Manifest、缓存',
        resources: [
          { type: 'doc', title: 'MDN PWA文档', url: 'https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps', description: 'MDN PWA教程', level: '入门', free: true },
          { type: 'article', title: 'Google PWA文档', url: 'https://web.dev/progressive-web-apps/', description: 'Google PWA指南', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'mini-program',
    skillName: '小程序开发',
    aliases: ['小程序', '微信小程序', '支付宝小程序', 'miniprogram', 'uniapp', 'Taro'],
    category: '前端开发',
    description: '微信/支付宝小程序开发',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: ['javascript', 'html-css'],
    relatedSkills: ['vue', 'react', 'javascript'],
    learningPath: [
      {
        phase: '小程序基础',
        goal: '掌握小程序框架、组件、API',
        resources: [
          { type: 'doc', title: '微信小程序文档', url: 'https://developers.weixin.qq.com/miniprogram/dev/framework/', description: '微信官方小程序文档', level: '入门', free: true },
          { type: 'doc', title: 'uni-app文档', url: 'https://uniapp.dcloud.net.cn/', description: '跨端框架uni-app', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'electron-tauri',
    skillName: 'Electron/Tauri',
    aliases: ['electron', 'tauri', '桌面应用', '跨平台桌面', 'Web桌面开发'],
    category: '前端开发',
    description: '用Web技术开发桌面应用',
    difficulty: '较难',
    estimatedTime: '3-6周',
    prerequisites: ['javascript', 'react', 'nodejs'],
    relatedSkills: ['react', 'vue', 'nodejs'],
    learningPath: [
      {
        phase: '桌面应用基础',
        goal: '掌握Electron/Tauri应用结构',
        resources: [
          { type: 'doc', title: 'Electron官方文档', url: 'https://www.electronjs.org/zh/docs/latest', description: 'Electron中文文档', level: '入门', free: true },
          { type: 'doc', title: 'Tauri官方文档', url: 'https://tauri.app/v1/guides/', description: 'Tauri指南', level: '进阶', free: true },
        ],
      },
    ],
  },

  // ========== 后端开发类 ==========
  {
    skillId: 'nodejs',
    skillName: 'Node.js',
    aliases: ['nodejs', 'node', 'Node', '服务端JS', 'Node.js运行时', 'npm', '事件驱动'],
    category: '后端开发',
    description: 'JavaScript运行时，全栈开发必备',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: ['javascript'],
    relatedSkills: ['express', 'nestjs', 'javascript'],
    learningPath: [
      {
        phase: '核心模块',
        goal: '掌握文件系统、网络、事件循环',
        resources: [
          { type: 'doc', title: 'Node.js官方文档', url: 'https://nodejs.org/zh-cn/docs', description: 'Node.js官方中文文档', level: '入门', free: true },
          { type: 'book', title: 'Node.js入门', url: 'https://www.runoob.com/nodejs/nodejs-tutorial.html', description: '菜鸟Node.js教程', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶开发',
        goal: '掌握异步编程、流、集群',
        resources: [
          { type: 'doc', title: 'Node.js进阶', url: 'https://nodejs.org/zh-cn/docs/guides/', description: 'Node.js官方指南', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'django',
    skillName: 'Django',
    aliases: ['django', 'Django框架', 'Python全栈', 'Django REST', 'ORM', 'MTV'],
    category: '后端开发',
    description: 'Python全栈Web框架',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: ['python'],
    relatedSkills: ['python', 'flask', 'rest-api'],
    learningPath: [
      {
        phase: '框架入门',
        goal: '掌握模型、视图、模板、路由',
        resources: [
          { type: 'doc', title: 'Django官方文档', url: 'https://docs.djangoproject.com/zh-hans/4.2/', description: 'Django官方中文文档', level: '入门', free: true },
          { type: 'article', title: '菜鸟教程 Django', url: 'https://www.runoob.com/django/django-tutorial.html', description: 'Django入门教程', level: '入门', free: true },
        ],
      },
      {
        phase: '实战进阶',
        goal: '掌握DRF、认证、部署',
        resources: [
          { type: 'doc', title: 'Django REST Framework', url: 'https://www.django-rest-framework.org/', description: 'DRF框架文档', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'flask',
    skillName: 'Flask',
    aliases: ['flask', 'Python轻量框架', '微框架', 'WSGI', 'Jinja2'],
    category: '后端开发',
    description: 'Python轻量级Web框架',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: ['python'],
    relatedSkills: ['django', 'fastapi', 'python'],
    learningPath: [
      {
        phase: '快速入门',
        goal: '掌握路由、模板、请求处理',
        resources: [
          { type: 'doc', title: 'Flask官方文档', url: 'https://dormousehole.readthedocs.io/en/latest/', description: 'Flask中文文档', level: '入门', free: true },
          { type: 'article', title: '菜鸟教程 Flask', url: 'https://www.runoob.com/flask/flask-tutorial.html', description: 'Flask入门教程', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'spring',
    skillName: 'Spring Boot',
    aliases: ['spring', 'springboot', 'Spring Boot', 'Java框架', 'IOC', 'AOP', 'SpringMVC'],
    category: '后端开发',
    description: 'Java企业级开发框架',
    difficulty: '较难',
    estimatedTime: '3-6个月',
    prerequisites: ['java'],
    relatedSkills: ['java', 'microservices', 'mysql'],
    learningPath: [
      {
        phase: '框架入门',
        goal: '掌握IoC、AOP、自动配置',
        resources: [
          { type: 'doc', title: 'Spring官方文档', url: 'https://spring.io/projects/spring-boot', description: 'Spring Boot官方文档', level: '入门', free: true },
          { type: 'article', title: '菜鸟教程 Spring Boot', url: 'https://www.runoob.com/spring-boot/spring-boot-tutorial.html', description: 'Spring Boot入门', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶实战',
        goal: '掌握Spring Cloud、安全、数据访问',
        resources: [
          { type: 'doc', title: 'Spring Cloud文档', url: 'https://spring.io/projects/spring-cloud', description: '微服务套件文档', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'express',
    skillName: 'Express',
    aliases: ['express', 'expressjs', 'Express.js', 'Node框架', 'Node Web框架'],
    category: '后端开发',
    description: 'Node.js轻量级Web框架',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: ['nodejs', 'javascript'],
    relatedSkills: ['nodejs', 'nestjs', 'rest-api'],
    learningPath: [
      {
        phase: '快速入门',
        goal: '掌握路由、中间件、模板',
        resources: [
          { type: 'doc', title: 'Express中文文档', url: 'https://www.expressjs.com.cn/', description: 'Express中文文档', level: '入门', free: true },
          { type: 'article', title: '菜鸟教程 Express', url: 'https://www.runoob.com/nodejs/nodejs-express-framework.html', description: 'Express入门教程', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'fastapi',
    skillName: 'FastAPI',
    aliases: ['fastapi', 'Fast API', '高性能Python框架', 'ASGI', 'Pydantic', '异步API'],
    category: '后端开发',
    description: 'Python高性能API框架',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: ['python'],
    relatedSkills: ['flask', 'python', 'rest-api'],
    learningPath: [
      {
        phase: '快速入门',
        goal: '掌握路由、依赖注入、数据验证',
        resources: [
          { type: 'doc', title: 'FastAPI官方文档', url: 'https://fastapi.tiangolo.com/zh/', description: 'FastAPI官方中文文档', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶实战',
        goal: '掌握异步数据库、认证、部署',
        resources: [
          { type: 'practice', title: 'FastAPI示例', url: 'https://github.com/tiangolo/full-stack-fastapi-template', description: '官方全栈模板', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'nestjs',
    skillName: 'NestJS',
    aliases: ['nestjs', 'Nest.js', 'Node企业框架', 'TypeScript后端', '依赖注入', '装饰器后端'],
    category: '后端开发',
    description: 'Node.js企业级框架，TypeScript优先',
    difficulty: '较难',
    estimatedTime: '2-4个月',
    prerequisites: ['typescript', 'nodejs'],
    relatedSkills: ['express', 'typescript', 'microservices'],
    learningPath: [
      {
        phase: '框架入门',
        goal: '掌握模块、控制器、提供者',
        resources: [
          { type: 'doc', title: 'NestJS官方文档', url: 'https://docs.nestjs.com/', description: 'NestJS官方文档', level: '入门', free: true },
          { type: 'doc', title: 'NestJS中文文档', url: 'https://docs.nestjs.cn/', description: 'NestJS中文文档', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'gin',
    skillName: 'Gin',
    aliases: ['gin', 'Gin框架', 'Go Web框架', '高性能Go后端', 'Gin路由'],
    category: '后端开发',
    description: 'Go高性能Web框架',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: ['go'],
    relatedSkills: ['go', 'grpc', 'microservices'],
    learningPath: [
      {
        phase: '快速入门',
        goal: '掌握路由、中间件、参数绑定',
        resources: [
          { type: 'doc', title: 'Gin官方文档', url: 'https://gin-gonic.com/zh-cn/docs/', description: 'Gin中文文档', level: '入门', free: true },
        ],
      },
      {
        phase: '实战项目',
        goal: '掌握完整Go后端开发',
        resources: [
          { type: 'practice', title: 'Gin示例项目', url: 'https://github.com/gin-gonic/examples', description: '官方示例集合', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'graphql',
    skillName: 'GraphQL',
    aliases: ['graphql', 'Graph QL', 'API查询语言', 'Schema', 'Apollo', 'Relay'],
    category: '后端开发',
    description: '灵活的API查询语言',
    difficulty: '较难',
    estimatedTime: '2-4周',
    prerequisites: ['rest-api', 'javascript'],
    relatedSkills: ['rest-api', 'nodejs', 'react'],
    learningPath: [
      {
        phase: '核心概念',
        goal: '掌握Schema、Query、Mutation',
        resources: [
          { type: 'doc', title: 'GraphQL官方文档', url: 'https://graphql.cn/learn/', description: 'GraphQL中文学习', level: '入门', free: true },
          { type: 'doc', title: 'Apollo文档', url: 'https://www.apollographql.com/docs/', description: 'Apollo GraphQL平台', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'grpc',
    skillName: 'gRPC',
    aliases: ['grpc', 'g RPC', 'RPC框架', 'Protobuf', 'Protocol Buffers', '微服务通信'],
    category: '后端开发',
    description: '高性能微服务通信协议',
    difficulty: '较难',
    estimatedTime: '2-4周',
    prerequisites: ['microservices'],
    relatedSkills: ['go', 'microservices', 'protobuf'],
    learningPath: [
      {
        phase: '协议基础',
        goal: '掌握Protobuf与gRPC服务定义',
        resources: [
          { type: 'doc', title: 'gRPC官方文档', url: 'https://grpc.io/docs/', description: 'gRPC官方文档', level: '入门', free: true },
          { type: 'doc', title: 'Protobuf文档', url: 'https://protobuf.dev/', description: 'Protocol Buffers文档', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'rest-api',
    skillName: 'REST API设计',
    aliases: ['rest', 'restful', 'RESTful API', 'API设计', 'HTTP API', '资源接口'],
    category: '后端开发',
    description: 'Web API设计规范与最佳实践',
    difficulty: '简单',
    estimatedTime: '1-2周',
    prerequisites: ['http'],
    relatedSkills: ['nodejs', 'fastapi', 'graphql'],
    learningPath: [
      {
        phase: '设计原则',
        goal: '掌握RESTful设计规范与状态码',
        resources: [
          { type: 'article', title: 'RESTful API设计指南', url: 'https://www.runoob.com/w3cnote/restful-architecture.html', description: 'REST架构风格讲解', level: '入门', free: true },
          { type: 'doc', title: 'REST API教程', url: 'https://restfulapi.net/', description: 'REST API设计资源', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'microservices',
    skillName: '微服务架构',
    aliases: ['microservices', '微服务', '分布式架构', '服务拆分', 'Spring Cloud', '服务网格'],
    category: '后端开发',
    description: '分布式服务架构设计与实现',
    difficulty: '较难',
    estimatedTime: '2-4个月',
    prerequisites: ['system-design', 'docker'],
    relatedSkills: ['kubernetes', 'grpc', 'spring', 'docker'],
    learningPath: [
      {
        phase: '架构理论',
        goal: '掌握微服务拆分与服务治理',
        resources: [
          { type: 'book', title: '微服务设计', url: 'https://book.douban.com/subject/26772677/', description: '微服务架构经典书籍', level: '进阶', free: false },
          { type: 'article', title: '微服务入门', url: 'https://www.runoob.com/w3cnote/microservice-architecture.html', description: '微服务架构介绍', level: '入门', free: true },
        ],
      },
      {
        phase: '工程实践',
        goal: '掌握服务注册发现、网关、链路追踪',
        resources: [
          { type: 'doc', title: 'Spring Cloud文档', url: 'https://spring.io/projects/spring-cloud', description: '微服务技术栈', level: '进阶', free: true },
        ],
      },
    ],
  },

  // ========== 数据库类 ==========
  {
    skillId: 'mysql',
    skillName: 'MySQL',
    aliases: ['mysql', 'MySQL数据库', '关系型数据库', 'SQL', 'MariaDB', 'InnoDB'],
    category: '数据库',
    description: '最流行的关系型数据库',
    difficulty: '简单',
    estimatedTime: '1-2个月',
    prerequisites: [],
    relatedSkills: ['sql', 'postgresql', 'redis'],
    learningPath: [
      {
        phase: 'SQL基础',
        goal: '掌握增删改查与多表连接',
        resources: [
          { type: 'article', title: '菜鸟教程 MySQL', url: 'https://www.runoob.com/mysql/mysql-tutorial.html', description: 'MySQL入门教程', level: '入门', free: true },
          { type: 'practice', title: 'SQLZoo练习', url: 'https://sqlzoo.net/', description: '在线SQL练习平台', level: '入门', free: true },
        ],
      },
      {
        phase: '优化进阶',
        goal: '掌握索引、事务、性能调优',
        resources: [
          { type: 'doc', title: 'MySQL官方文档', url: 'https://dev.mysql.com/doc/', description: 'MySQL官方文档', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'postgresql',
    skillName: 'PostgreSQL',
    aliases: ['postgresql', 'postgres', 'pg', 'PG数据库', '高级关系型数据库', 'PostGIS'],
    category: '数据库',
    description: '强大的开源关系型数据库',
    difficulty: '中等',
    estimatedTime: '1-2个月',
    prerequisites: ['mysql'],
    relatedSkills: ['mysql', 'redis', 'elasticsearch'],
    learningPath: [
      {
        phase: '基础与进阶',
        goal: '掌握PG特性、JSONB、窗口函数',
        resources: [
          { type: 'doc', title: 'PostgreSQL官方文档', url: 'https://www.postgresql.org/docs/', description: 'PostgreSQL官方文档', level: '入门', free: true },
          { type: 'article', title: 'PostgreSQL教程', url: 'https://www.runoob.com/postgresql/postgresql-tutorial.html', description: 'PG入门教程', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'mongodb',
    skillName: 'MongoDB',
    aliases: ['mongodb', 'mongo', 'NoSQL', '文档数据库', 'BSON', 'Atlas'],
    category: '数据库',
    description: '流行的文档型NoSQL数据库',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: [],
    relatedSkills: ['mysql', 'redis', 'nodejs'],
    learningPath: [
      {
        phase: '基础操作',
        goal: '掌握文档CRUD与聚合管道',
        resources: [
          { type: 'doc', title: 'MongoDB官方文档', url: 'https://www.mongodb.com/docs/manual/', description: 'MongoDB官方文档', level: '入门', free: true },
          { type: 'article', title: '菜鸟教程 MongoDB', url: 'https://www.runoob.com/mongodb/mongodb-tutorial.html', description: 'MongoDB入门教程', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'redis',
    skillName: 'Redis',
    aliases: ['redis', '缓存', '内存数据库', 'Redis缓存', 'Key-Value', '分布式锁'],
    category: '数据库',
    description: '高性能内存数据库，缓存首选',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: [],
    relatedSkills: ['mysql', 'mongodb', 'microservices'],
    learningPath: [
      {
        phase: '数据结构与缓存',
        goal: '掌握5种数据结构与缓存策略',
        resources: [
          { type: 'doc', title: 'Redis官方文档', url: 'https://redis.io/docs/', description: 'Redis官方文档', level: '入门', free: true },
          { type: 'article', title: '菜鸟教程 Redis', url: 'https://www.runoob.com/redis/redis-tutorial.html', description: 'Redis入门教程', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶应用',
        goal: '掌握持久化、集群、分布式锁',
        resources: [
          { type: 'book', title: 'Redis设计与实现', url: 'https://book.douban.com/subject/25900139/', description: 'Redis底层原理', level: '进阶', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'elasticsearch',
    skillName: 'Elasticsearch',
    aliases: ['elasticsearch', 'es', 'ES搜索引擎', '全文搜索', 'ELK', 'Lucene'],
    category: '数据库',
    description: '分布式搜索和分析引擎',
    difficulty: '较难',
    estimatedTime: '1-2个月',
    prerequisites: [],
    relatedSkills: ['kafka', 'data-analysis', 'monitoring'],
    learningPath: [
      {
        phase: '搜索基础',
        goal: '掌握索引、查询DSL、分词',
        resources: [
          { type: 'doc', title: 'Elasticsearch官方文档', url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html', description: 'ES官方文档', level: '入门', free: true },
          { type: 'article', title: 'ES教程', url: 'https://www.runoob.com/elasticsearch/elasticsearch-tutorial.html', description: 'ES入门教程', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'clickhouse',
    skillName: 'ClickHouse',
    aliases: ['clickhouse', 'CH', '列式数据库', 'OLAP', '实时分析', 'Yandex数据库'],
    category: '数据库',
    description: '列式数据库，OLAP分析利器',
    difficulty: '较难',
    estimatedTime: '2-4周',
    prerequisites: ['mysql'],
    relatedSkills: ['mysql', 'etl', 'data-analysis'],
    learningPath: [
      {
        phase: '基础与分析',
        goal: '掌握列式存储与OLAP查询',
        resources: [
          { type: 'doc', title: 'ClickHouse官方文档', url: 'https://clickhouse.com/docs/zh', description: 'ClickHouse中文文档', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'sqlite',
    skillName: 'SQLite',
    aliases: ['sqlite', '嵌入式数据库', '轻量数据库', '本地数据库', 'SQLite3'],
    category: '数据库',
    description: '轻量级嵌入式数据库',
    difficulty: '入门',
    estimatedTime: '1-2周',
    prerequisites: [],
    relatedSkills: ['mysql', 'postgresql'],
    learningPath: [
      {
        phase: '基础使用',
        goal: '掌握SQLite操作与嵌入式集成',
        resources: [
          { type: 'doc', title: 'SQLite官方文档', url: 'https://www.sqlite.org/docs.html', description: 'SQLite官方文档', level: '入门', free: true },
          { type: 'article', title: '菜鸟教程 SQLite', url: 'https://www.runoob.com/sqlite/sqlite-tutorial.html', description: 'SQLite入门教程', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'kafka',
    skillName: 'Kafka',
    aliases: ['kafka', '消息队列', '流处理', 'Kafka队列', '分布式消息', 'Kafka Streams'],
    category: '数据库',
    description: '分布式消息队列，流处理平台',
    difficulty: '较难',
    estimatedTime: '2-4周',
    prerequisites: [],
    relatedSkills: ['microservices', 'etl', 'redis'],
    learningPath: [
      {
        phase: '消息模型',
        goal: '掌握Topic、Partition、Consumer',
        resources: [
          { type: 'doc', title: 'Kafka官方文档', url: 'https://kafka.apache.org/documentation/', description: 'Kafka官方文档', level: '入门', free: true },
          { type: 'article', title: 'Kafka入门教程', url: 'https://www.runoob.com/kafka/kafka-tutorial.html', description: 'Kafka中文教程', level: '入门', free: true },
        ],
      },
    ],
  },

  // ========== 人工智能类 ==========
  {
    skillId: 'machine-learning',
    skillName: '机器学习',
    aliases: ['machine-learning', 'ML', '机器学习算法', '监督学习', '无监督学习', 'sklearn', 'scikit-learn'],
    category: '人工智能',
    description: '让计算机从数据中学习规律和模式',
    difficulty: '较难',
    estimatedTime: '3-6个月',
    prerequisites: ['python', 'math-linear', 'math-stats'],
    relatedSkills: ['deep-learning', 'data-analysis', 'pytorch'],
    learningPath: [
      {
        phase: '理论基础',
        goal: '掌握线性回归、决策树、聚类等经典算法',
        resources: [
          { type: 'doc', title: 'scikit-learn文档', url: 'https://scikit-learn.org/stable/', description: 'sklearn官方文档', level: '入门', free: true },
          { type: 'book', title: '西瓜书', url: 'https://book.douban.com/subject/26708119/', description: '机器学习周志华', level: '进阶', free: false },
        ],
      },
      {
        phase: '实战项目',
        goal: '完成端到端机器学习项目',
        resources: [
          { type: 'practice', title: 'Kaggle竞赛', url: 'https://www.kaggle.com/', description: '数据科学竞赛平台', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'deep-learning',
    skillName: '深度学习',
    aliases: ['deep-learning', 'DL', '深度学习', '神经网络', 'CNN', 'RNN', 'Transformer'],
    category: '人工智能',
    description: '神经网络深度学习技术',
    difficulty: '困难',
    estimatedTime: '4-8个月',
    prerequisites: ['machine-learning', 'math-linear'],
    relatedSkills: ['pytorch', 'tensorflow', 'nlp'],
    learningPath: [
      {
        phase: '神经网络基础',
        goal: '掌握前馈网络、反向传播、优化算法',
        resources: [
          { type: 'doc', title: '动手学深度学习', url: 'https://zh.d2l.ai/', description: '李沐深度学习教材', level: '入门', free: true },
          { type: 'book', title: '花书深度学习', url: 'https://book.douban.com/subject/27087503/', description: 'Goodfellow深度学习', level: '进阶', free: false },
        ],
      },
      {
        phase: '进阶架构',
        goal: '掌握CNN、RNN、Transformer',
        resources: [
          { type: 'practice', title: 'PyTorch教程', url: 'https://pytorch.org/tutorials/', description: '官方实践教程', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'nlp',
    skillName: '自然语言处理',
    aliases: ['nlp', '自然语言处理', '文本分析', 'NLP', '语言模型', '分词', 'BERT'],
    category: '人工智能',
    description: '处理和理解人类语言',
    difficulty: '较难',
    estimatedTime: '3-6个月',
    prerequisites: ['deep-learning', 'python'],
    relatedSkills: ['llm', 'machine-learning', 'pytorch'],
    learningPath: [
      {
        phase: 'NLP基础',
        goal: '掌握分词、词向量、文本分类',
        resources: [
          { type: 'doc', title: 'HuggingFace NLP课程', url: 'https://huggingface.co/learn/nlp-course', description: 'HuggingFace NLP教程', level: '入门', free: true },
          { type: 'book', title: '自然语言处理实战', url: 'https://book.douban.com/subject/35010035/', description: 'NLP实战书籍', level: '进阶', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'computer-vision',
    skillName: '计算机视觉',
    aliases: ['computer-vision', 'CV', '图像识别', '目标检测', '图像分割', 'OpenCV', 'YOLO'],
    category: '人工智能',
    description: '图像识别和处理技术',
    difficulty: '较难',
    estimatedTime: '3-6个月',
    prerequisites: ['deep-learning', 'python'],
    relatedSkills: ['pytorch', 'deep-learning', 'machine-learning'],
    learningPath: [
      {
        phase: '图像处理基础',
        goal: '掌握OpenCV与图像基础操作',
        resources: [
          { type: 'doc', title: 'OpenCV官方文档', url: 'https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html', description: 'OpenCV Python教程', level: '入门', free: true },
          { type: 'doc', title: 'PyTorch Vision', url: 'https://pytorch.org/vision/stable/', description: 'torchvision计算机视觉库', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'pytorch',
    skillName: 'PyTorch',
    aliases: ['pytorch', 'torch', 'PyTorch框架', '深度学习框架', 'Facebook框架', '动态图'],
    category: '人工智能',
    description: '流行的深度学习框架',
    difficulty: '中等',
    estimatedTime: '1-2个月',
    prerequisites: ['python', 'deep-learning'],
    relatedSkills: ['tensorflow', 'deep-learning', 'huggingface'],
    learningPath: [
      {
        phase: '框架入门',
        goal: '掌握Tensor、自动求导、模型训练',
        resources: [
          { type: 'doc', title: 'PyTorch官方教程', url: 'https://pytorch.org/tutorials/', description: 'PyTorch官方教程', level: '入门', free: true },
          { type: 'doc', title: 'PyTorch中文文档', url: 'https://pytorch-cn.readthedocs.io/zh/latest/', description: 'PyTorch中文文档', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'tensorflow',
    skillName: 'TensorFlow',
    aliases: ['tensorflow', 'tf', 'TF框架', 'Google深度学习', 'Keras', 'TF2'],
    category: '人工智能',
    description: 'Google深度学习框架',
    difficulty: '中等',
    estimatedTime: '1-2个月',
    prerequisites: ['python', 'deep-learning'],
    relatedSkills: ['pytorch', 'deep-learning', 'mlops'],
    learningPath: [
      {
        phase: '框架入门',
        goal: '掌握Keras高层API与模型训练',
        resources: [
          { type: 'doc', title: 'TensorFlow官方教程', url: 'https://www.tensorflow.org/tutorials?hl=zh-cn', description: 'TF官方中文教程', level: '入门', free: true },
          { type: 'doc', title: 'Keras文档', url: 'https://keras.io/zh/', description: 'Keras中文文档', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'llm',
    skillName: '大语言模型',
    aliases: ['llm', '大模型', '大语言模型', 'ChatGPT', 'GPT', 'Transformer', 'AGI'],
    category: '人工智能',
    description: 'ChatGPT等大模型原理与应用开发',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: ['nlp', 'deep-learning'],
    relatedSkills: ['langchain', 'prompt-engineering', 'aigc'],
    learningPath: [
      {
        phase: '原理与应用',
        goal: '理解Transformer与LLM工作原理',
        resources: [
          { type: 'doc', title: 'HuggingFace LLM课程', url: 'https://huggingface.co/learn/llm-course', description: 'LLM应用课程', level: '入门', free: true },
          { type: 'article', title: 'Transformer图解', url: 'https://jalammar.github.io/illustrated-transformer/', description: 'Transformer原理图解', level: '进阶', free: true },
        ],
      },
      {
        phase: '应用开发',
        goal: '掌握LLM微调与部署',
        resources: [
          { type: 'doc', title: 'OpenAI API文档', url: 'https://platform.openai.com/docs', description: 'OpenAI官方API', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'aigc',
    skillName: 'AIGC',
    aliases: ['aigc', 'AI生成内容', 'AI绘画', 'Stable Diffusion', 'Midjourney', 'AI创作', '生成式AI'],
    category: '人工智能',
    description: 'AI生成内容，图像/视频/音乐生成',
    difficulty: '中等',
    estimatedTime: '1-3个月',
    prerequisites: ['llm'],
    relatedSkills: ['llm', 'prompt-engineering', 'computer-vision'],
    learningPath: [
      {
        phase: 'AIGC工具',
        goal: '掌握主流AI生成工具',
        resources: [
          { type: 'doc', title: 'Stable Diffusion文档', url: 'https://stability.ai/documentation', description: 'SD官方文档', level: '入门', free: true },
          { type: 'practice', title: 'HuggingFace Spaces', url: 'https://huggingface.co/spaces', description: '在线AI应用体验', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'langchain',
    skillName: 'LangChain',
    aliases: ['langchain', 'LangChain框架', 'LLM应用框架', 'Agent框架', 'RAG', 'Chain'],
    category: '人工智能',
    description: 'LLM应用开发框架',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: ['llm', 'python'],
    relatedSkills: ['llm', 'prompt-engineering', 'huggingface'],
    learningPath: [
      {
        phase: '框架入门',
        goal: '掌握Chain、Agent、Memory、RAG',
        resources: [
          { type: 'doc', title: 'LangChain官方文档', url: 'https://python.langchain.com/docs/get_started/introduction', description: 'LangChain官方文档', level: '入门', free: true },
          { type: 'doc', title: 'LangChain中文文档', url: 'https://www.langchain.cn/', description: 'LangChain中文文档', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'prompt-engineering',
    skillName: '提示工程',
    aliases: ['prompt-engineering', '提示工程', 'Prompt', '提示词', 'Prompt技巧', 'AI对话'],
    category: '人工智能',
    description: '高效使用AI的提示词技巧',
    difficulty: '简单',
    estimatedTime: '1-2周',
    prerequisites: [],
    relatedSkills: ['llm', 'langchain', 'aigc'],
    learningPath: [
      {
        phase: '提示技巧',
        goal: '掌握Prompt设计原则与模式',
        resources: [
          { type: 'doc', title: 'OpenAI Prompt指南', url: 'https://platform.openai.com/docs/guides/prompt-engineering', description: 'OpenAI官方提示工程', level: '入门', free: true },
          { type: 'article', title: 'Prompt Engineering指南', url: 'https://www.promptingguide.ai/zh', description: '中文Prompt指南', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'reinforcement-learning',
    skillName: '强化学习',
    aliases: ['reinforcement-learning', 'RL', '强化学习', 'RLHF', 'Q-Learning', 'PPO', '智能体'],
    category: '人工智能',
    description: '智能体通过奖励机制学习决策',
    difficulty: '困难',
    estimatedTime: '3-6个月',
    prerequisites: ['deep-learning', 'math-stats'],
    relatedSkills: ['deep-learning', 'machine-learning'],
    learningPath: [
      {
        phase: 'RL基础',
        goal: '掌握MDP、Q-Learning、策略梯度',
        resources: [
          { type: 'book', title: '强化学习( Sutton )', url: 'https://book.douban.com/subject/35046156/', description: 'RL经典教材', level: '进阶', free: false },
          { type: 'doc', title: 'Spinning Up', url: 'https://spinningup.openai.com/', description: 'OpenAI RL教程', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'mlops',
    skillName: 'MLOps',
    aliases: ['mlops', 'ML Ops', '模型运维', 'AI工程化', '模型部署', 'MLflow', '模型流水线'],
    category: '人工智能',
    description: '机器学习模型部署与运维',
    difficulty: '较难',
    estimatedTime: '2-4个月',
    prerequisites: ['machine-learning', 'docker'],
    relatedSkills: ['machine-learning', 'cicd', 'monitoring'],
    learningPath: [
      {
        phase: '工程化实践',
        goal: '掌握模型版本管理与部署',
        resources: [
          { type: 'doc', title: 'MLflow文档', url: 'https://mlflow.org/docs/latest/index.html', description: 'MLflow模型管理', level: '进阶', free: true },
          { type: 'doc', title: 'Kubeflow文档', url: 'https://www.kubeflow.org/docs/', description: 'K8s上的ML平台', level: '高级', free: true },
        ],
      },
    ],
  },

  // ========== DevOps类 ==========
  {
    skillId: 'git',
    skillName: 'Git',
    aliases: ['git', '版本控制', 'GitHub', 'GitLab', '代码管理', '版本管理', 'VCS'],
    category: 'DevOps',
    description: '版本控制必备技能',
    difficulty: '入门',
    estimatedTime: '1-2周',
    prerequisites: [],
    relatedSkills: ['github', 'cicd', 'linux'],
    learningPath: [
      {
        phase: '基础操作',
        goal: '掌握add、commit、branch、merge',
        resources: [
          { type: 'book', title: 'Pro Git中文版', url: 'https://git-scm.com/book/zh/v2', description: 'Git官方书籍', level: '入门', free: true },
          { type: 'article', title: '菜鸟教程 Git', url: 'https://www.runoob.com/git/git-tutorial.html', description: 'Git入门教程', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶协作',
        goal: '掌握rebase、cherry-pick、工作流',
        resources: [
          { type: 'practice', title: 'Learn Git Branching', url: 'https://learngitbranching.js.org/?locale=zh_CN', description: '可视化Git练习', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'docker',
    skillName: 'Docker',
    aliases: ['docker', '容器', '容器化', 'Dockerfile', '镜像', 'Docker Compose'],
    category: 'DevOps',
    description: '容器化部署技术',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: ['linux'],
    relatedSkills: ['kubernetes', 'cicd', 'microservices'],
    learningPath: [
      {
        phase: '容器基础',
        goal: '掌握镜像、容器、Dockerfile',
        resources: [
          { type: 'doc', title: 'Docker官方文档', url: 'https://docs.docker.com/', description: 'Docker官方文档', level: '入门', free: true },
          { type: 'article', title: '菜鸟教程 Docker', url: 'https://www.runoob.com/docker/docker-tutorial.html', description: 'Docker入门教程', level: '入门', free: true },
        ],
      },
      {
        phase: '编排进阶',
        goal: '掌握Compose与多容器编排',
        resources: [
          { type: 'doc', title: 'Docker Compose文档', url: 'https://docs.docker.com/compose/', description: 'Compose官方文档', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'kubernetes',
    skillName: 'Kubernetes',
    aliases: ['kubernetes', 'k8s', 'K8s', '容器编排', 'Kubernetes集群', 'Pod'],
    category: 'DevOps',
    description: '容器编排平台',
    difficulty: '较难',
    estimatedTime: '2-4个月',
    prerequisites: ['docker', 'linux'],
    relatedSkills: ['docker', 'cicd', 'microservices'],
    learningPath: [
      {
        phase: 'K8s基础',
        goal: '掌握Pod、Deployment、Service',
        resources: [
          { type: 'doc', title: 'Kubernetes官方文档', url: 'https://kubernetes.io/zh-cn/docs/', description: 'K8s官方中文文档', level: '入门', free: true },
          { type: 'doc', title: 'K8s教程', url: 'https://www.runoob.com/kubernetes/kubernetes-tutorial.html', description: 'K8s入门教程', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶运维',
        goal: '掌握Helm、Operator、网络与存储',
        resources: [
          { type: 'doc', title: 'Helm文档', url: 'https://helm.sh/zh/docs/', description: 'K8s包管理器', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'cicd',
    skillName: 'CI/CD',
    aliases: ['cicd', 'CI/CD', '持续集成', '持续部署', '流水线', 'Jenkins', 'GitHub Actions'],
    category: 'DevOps',
    description: '持续集成与持续部署',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: ['git', 'docker'],
    relatedSkills: ['git', 'docker', 'kubernetes'],
    learningPath: [
      {
        phase: '流水线搭建',
        goal: '掌握CI/CD流程与工具',
        resources: [
          { type: 'doc', title: 'GitHub Actions文档', url: 'https://docs.github.com/zh/actions', description: 'GitHub Actions文档', level: '入门', free: true },
          { type: 'doc', title: 'Jenkins文档', url: 'https://www.jenkins.io/zh/doc/', description: 'Jenkins中文文档', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'linux',
    skillName: 'Linux',
    aliases: ['linux', 'Linux系统', 'Shell', '命令行', 'Ubuntu', 'CentOS', '运维基础'],
    category: 'DevOps',
    description: '服务器操作系统必备',
    difficulty: '中等',
    estimatedTime: '1-2个月',
    prerequisites: [],
    relatedSkills: ['docker', 'nginx', 'shell-scripting'],
    learningPath: [
      {
        phase: '命令与文件系统',
        goal: '掌握常用命令、权限、文件操作',
        resources: [
          { type: 'article', title: '菜鸟教程 Linux', url: 'https://www.runoob.com/linux/linux-tutorial.html', description: 'Linux入门教程', level: '入门', free: true },
          { type: 'book', title: '鸟哥的Linux私房菜', url: 'https://linux.vbird.org/', description: 'Linux经典教程', level: '入门', free: true },
        ],
      },
      {
        phase: 'Shell与运维',
        goal: '掌握Shell脚本与系统管理',
        resources: [
          { type: 'article', title: 'Shell教程', url: 'https://www.runoob.com/linux/linux-shell.html', description: 'Shell脚本教程', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'nginx',
    skillName: 'Nginx',
    aliases: ['nginx', 'Web服务器', '反向代理', '负载均衡', 'Nginx配置'],
    category: 'DevOps',
    description: '高性能Web服务器和反向代理',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: ['linux'],
    relatedSkills: ['linux', 'docker', 'microservices'],
    learningPath: [
      {
        phase: '配置与部署',
        goal: '掌握虚拟主机、反向代理、负载均衡',
        resources: [
          { type: 'doc', title: 'Nginx官方文档', url: 'https://nginx.org/en/docs/', description: 'Nginx官方文档', level: '入门', free: true },
          { type: 'article', title: '菜鸟教程 Nginx', url: 'https://www.runoob.com/linux/nginx-install-setup.html', description: 'Nginx安装配置', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'terraform',
    skillName: 'Terraform',
    aliases: ['terraform', 'IaC', '基础设施即代码', 'Terraform配置', 'HCL'],
    category: 'DevOps',
    description: '基础设施即代码工具',
    difficulty: '较难',
    estimatedTime: '2-4周',
    prerequisites: ['cloud-aws', 'linux'],
    relatedSkills: ['ansible', 'cloud-aws', 'cicd'],
    learningPath: [
      {
        phase: 'IaC基础',
        goal: '掌握HCL语法与资源管理',
        resources: [
          { type: 'doc', title: 'Terraform官方文档', url: 'https://developer.hashicorp.com/terraform/docs', description: 'Terraform官方文档', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'ansible',
    skillName: 'Ansible',
    aliases: ['ansible', '自动化运维', '配置管理', 'Playbook', 'Ansible自动化'],
    category: 'DevOps',
    description: '自动化配置管理工具',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: ['linux'],
    relatedSkills: ['terraform', 'docker', 'cicd'],
    learningPath: [
      {
        phase: '自动化入门',
        goal: '掌握Playbook与角色',
        resources: [
          { type: 'doc', title: 'Ansible官方文档', url: 'https://docs.ansible.com/ansible/latest/index.html', description: 'Ansible官方文档', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'cloud-aws',
    skillName: 'AWS/阿里云',
    aliases: ['aws', '阿里云', '云计算', 'EC2', 'S3', '云服务', 'AWS云计算'],
    category: 'DevOps',
    description: '主流云计算平台使用',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: ['linux', 'networking'],
    relatedSkills: ['docker', 'kubernetes', 'terraform'],
    learningPath: [
      {
        phase: '云服务入门',
        goal: '掌握计算、存储、网络核心服务',
        resources: [
          { type: 'doc', title: 'AWS官方文档', url: 'https://docs.aws.amazon.com/zh_cn/', description: 'AWS中文文档', level: '入门', free: true },
          { type: 'doc', title: '阿里云文档', url: 'https://help.aliyun.com/', description: '阿里云官方文档', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'monitoring',
    skillName: '监控运维',
    aliases: ['monitoring', '监控', 'Prometheus', 'Grafana', '可观测性', '告警', '运维监控'],
    category: 'DevOps',
    description: 'Prometheus/Grafana系统监控',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: ['linux', 'docker'],
    relatedSkills: ['kubernetes', 'linux', 'nginx'],
    learningPath: [
      {
        phase: '监控体系',
        goal: '掌握指标采集与可视化',
        resources: [
          { type: 'doc', title: 'Prometheus文档', url: 'https://prometheus.io/docs/introduction/overview/', description: 'Prometheus官方文档', level: '入门', free: true },
          { type: 'doc', title: 'Grafana文档', url: 'https://grafana.com/docs/', description: 'Grafana官方文档', level: '入门', free: true },
        ],
      },
    ],
  },

  // ========== 数据分析类 ==========
  {
    skillId: 'data-analysis',
    skillName: '数据分析',
    aliases: ['data-analysis', '数据分析', '数据洞察', '业务分析', '数据思维', '分析报告'],
    category: '数据分析',
    description: '数据收集、处理和分析',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: ['excel', 'python'],
    relatedSkills: ['pandas', 'data-visualization', 'math-stats'],
    learningPath: [
      {
        phase: '分析方法论',
        goal: '掌握数据分析思维与流程',
        resources: [
          { type: 'book', title: '数据分析思维', url: 'https://book.douban.com/subject/35394114/', description: '数据分析方法论', level: '入门', free: false },
          { type: 'practice', title: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', description: 'Kaggle数据分析课程', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'data-visualization',
    skillName: '数据可视化',
    aliases: ['data-visualization', '数据可视化', '图表', 'D3.js', 'ECharts', '可视化大屏'],
    category: '数据分析',
    description: '将数据以图表形式展示',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: ['javascript'],
    relatedSkills: ['data-analysis', 'svg-canvas', 'pandas'],
    learningPath: [
      {
        phase: '可视化库',
        goal: '掌握ECharts、D3等可视化工具',
        resources: [
          { type: 'doc', title: 'ECharts文档', url: 'https://echarts.apache.org/zh/index.html', description: 'ECharts可视化库', level: '入门', free: true },
          { type: 'doc', title: 'D3.js文档', url: 'https://d3js.org/', description: 'D3数据驱动文档', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'excel',
    skillName: 'Excel',
    aliases: ['excel', '表格', '电子表格', 'Excel函数', 'VLOOKUP', '数据透视表'],
    category: '数据分析',
    description: '办公数据处理必备',
    difficulty: '入门',
    estimatedTime: '1-2周',
    prerequisites: [],
    relatedSkills: ['data-analysis', 'powerbi'],
    learningPath: [
      {
        phase: '函数与透视表',
        goal: '掌握常用函数与数据透视表',
        resources: [
          { type: 'article', title: 'Excel教程', url: 'https://www.runoob.com/excel/excel-tutorial.html', description: 'Excel基础教程', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'pandas',
    skillName: 'Pandas',
    aliases: ['pandas', 'DataFrame', 'Python数据分析', '数据处理', 'pandas库'],
    category: '数据分析',
    description: 'Python数据分析核心库',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: ['python', 'numpy'],
    relatedSkills: ['numpy', 'data-analysis', 'python'],
    learningPath: [
      {
        phase: '数据处理',
        goal: '掌握DataFrame操作与数据清洗',
        resources: [
          { type: 'doc', title: 'Pandas官方文档', url: 'https://pandas.pydata.org/docs/', description: 'Pandas官方文档', level: '入门', free: true },
          { type: 'book', title: 'Pandas中文教程', url: 'https://www.pypandas.cn/', description: 'Pandas中文文档', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'numpy',
    skillName: 'NumPy',
    aliases: ['numpy', 'np', '科学计算', '数值计算', 'ndarray', 'Python数学库'],
    category: '数据分析',
    description: 'Python科学计算基础库',
    difficulty: '简单',
    estimatedTime: '1-2周',
    prerequisites: ['python'],
    relatedSkills: ['pandas', 'python', 'machine-learning'],
    learningPath: [
      {
        phase: '数值计算',
        goal: '掌握数组操作与线性代数',
        resources: [
          { type: 'doc', title: 'NumPy官方文档', url: 'https://numpy.org/doc/stable/', description: 'NumPy官方文档', level: '入门', free: true },
          { type: 'article', title: 'NumPy教程', url: 'https://www.runoob.com/numpy/numpy-tutorial.html', description: 'NumPy入门教程', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'tableau',
    skillName: 'Tableau',
    aliases: ['tableau', '数据可视化工具', 'BI工具', 'Tableau Desktop', '商业智能'],
    category: '数据分析',
    description: '商业智能可视化工具',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: [],
    relatedSkills: ['powerbi', 'data-visualization', 'data-analysis'],
    learningPath: [
      {
        phase: '可视化工具',
        goal: '掌握仪表盘与数据连接',
        resources: [
          { type: 'doc', title: 'Tableau官方文档', url: 'https://help.tableau.com/current/guides/get-started-tutorial/zh-cn/get-started-tutorial-home.htm', description: 'Tableau官方教程', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'powerbi',
    skillName: 'Power BI',
    aliases: ['powerbi', 'Power BI', '微软BI', '商业分析', 'PowerBI报表'],
    category: '数据分析',
    description: '微软商业数据分析工具',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: ['excel'],
    relatedSkills: ['tableau', 'excel', 'data-analysis'],
    learningPath: [
      {
        phase: '报表与建模',
        goal: '掌握数据建模与DAX',
        resources: [
          { type: 'doc', title: 'Power BI文档', url: 'https://learn.microsoft.com/zh-cn/power-bi/', description: '微软Power BI文档', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'etl',
    skillName: 'ETL',
    aliases: ['etl', '数据仓库', '数据管道', '数据集成', 'ETL流程', '数据抽取'],
    category: '数据分析',
    description: '数据抽取、转换和加载',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: ['sql', 'python'],
    relatedSkills: ['kafka', 'data-analysis', 'scala'],
    learningPath: [
      {
        phase: 'ETL工程',
        goal: '掌握数据抽取、转换、加载流程',
        resources: [
          { type: 'doc', title: 'Airflow文档', url: 'https://airflow.apache.org/docs/', description: 'Apache Airflow数据管道', level: '进阶', free: true },
        ],
      },
    ],
  },

  // ========== 计算机基础类 ==========
  {
    skillId: 'algorithms',
    skillName: '算法与数据结构',
    aliases: ['algorithms', '算法', '数据结构', '刷题', 'LeetCode', '排序', '动态规划'],
    category: '计算机基础',
    description: '编程核心能力，面试必备',
    difficulty: '较难',
    estimatedTime: '3-6个月',
    prerequisites: [],
    relatedSkills: ['cpp', 'java', 'python'],
    learningPath: [
      {
        phase: '基础数据结构',
        goal: '掌握数组、链表、栈、队列、树、图',
        resources: [
          { type: 'book', title: '算法(第四版)', url: 'https://book.douban.com/subject/19952400/', description: 'Sedgewick算法经典', level: '入门', free: false },
          { type: 'article', title: '菜鸟教程 数据结构', url: 'https://www.runoob.com/data-structures/data-structures-tutorial.html', description: '数据结构入门', level: '入门', free: true },
        ],
      },
      {
        phase: '算法刷题',
        goal: '掌握常见算法题型与解题思路',
        resources: [
          { type: 'practice', title: 'LeetCode题库', url: 'https://leetcode.cn/problemset/all/', description: '在线刷题平台', level: '进阶', free: true },
          { type: 'doc', title: '代码随想录', url: 'https://programmercarl.com/', description: '算法刷题指南', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'system-design',
    skillName: '系统设计',
    aliases: ['system-design', '系统设计', '架构设计', '分布式系统', '高并发', '系统架构'],
    category: '计算机基础',
    description: '大规模系统架构设计',
    difficulty: '较难',
    estimatedTime: '2-4个月',
    prerequisites: ['algorithms', 'microservices'],
    relatedSkills: ['microservices', 'kubernetes', 'mysql'],
    learningPath: [
      {
        phase: '架构设计',
        goal: '掌握高可用、高并发系统设计',
        resources: [
          { type: 'doc', title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer/blob/master/README-zh-Hans.md', description: '系统设计入门(中文)', level: '进阶', free: true },
          { type: 'book', title: '数据密集型应用系统设计', url: 'https://book.douban.com/subject/30329599/', description: 'DDIA分布式经典', level: '高级', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'networking',
    skillName: '计算机网络',
    aliases: ['networking', '计算机网络', '网络基础', 'TCP/IP', 'HTTP', 'OSI模型'],
    category: '计算机基础',
    description: '网络通信基础，TCP/IP协议',
    difficulty: '中等',
    estimatedTime: '1-2个月',
    prerequisites: [],
    relatedSkills: ['tcp-ip', 'operating-systems', 'linux'],
    learningPath: [
      {
        phase: '网络协议',
        goal: '掌握OSI七层与TCP/IP协议',
        resources: [
          { type: 'book', title: '计算机网络(自顶向下)', url: 'https://book.douban.com/subject/30280001/', description: '计算机网络经典教材', level: '入门', free: false },
          { type: 'article', title: '网络教程', url: 'https://www.runoob.com/http/http-tutorial.html', description: 'HTTP协议教程', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'operating-systems',
    skillName: '操作系统',
    aliases: ['operating-systems', 'OS', '操作系统原理', '进程线程', '内存管理', 'Linux内核'],
    category: '计算机基础',
    description: '计算机系统底层原理',
    difficulty: '较难',
    estimatedTime: '2-4个月',
    prerequisites: [],
    relatedSkills: ['linux', 'computer-architecture', 'c-lang'],
    learningPath: [
      {
        phase: 'OS原理',
        goal: '掌握进程、内存、文件系统',
        resources: [
          { type: 'book', title: '操作系统导论', url: 'https://book.douban.com/subject/30394024/', description: 'OSTEP操作系统教材', level: '进阶', free: false },
          { type: 'doc', title: 'OSTEP中文', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', description: '操作系统导论英文原版', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'design-patterns',
    skillName: '设计模式',
    aliases: ['design-patterns', '设计模式', 'GoF', '单例', '工厂', '观察者', 'SOLID'],
    category: '计算机基础',
    description: '软件设计经典模式，代码复用',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: ['java'],
    relatedSkills: ['java', 'software-engineering', 'system-design'],
    learningPath: [
      {
        phase: '模式学习',
        goal: '掌握23种设计模式',
        resources: [
          { type: 'article', title: '菜鸟教程 设计模式', url: 'https://www.runoob.com/design-pattern/design-pattern-tutorial.html', description: '设计模式教程', level: '入门', free: true },
          { type: 'book', title: '设计模式( GoF )', url: 'https://book.douban.com/subject/3426279/', description: 'GoF设计模式经典', level: '进阶', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'compiler',
    skillName: '编译原理',
    aliases: ['compiler', '编译原理', '编译器', '词法分析', '语法分析', 'AST', 'LLVM'],
    category: '计算机基础',
    description: '编程语言实现基础',
    difficulty: '困难',
    estimatedTime: '3-6个月',
    prerequisites: ['algorithms', 'data-structures'],
    relatedSkills: ['algorithms', 'operating-systems'],
    learningPath: [
      {
        phase: '编译原理',
        goal: '掌握词法、语法分析与代码生成',
        resources: [
          { type: 'book', title: '编译原理(龙书)', url: 'https://book.douban.com/subject/3296317/', description: '编译原理经典教材', level: '高级', free: false },
          { type: 'doc', title: 'Crafting Interpreters', url: 'https://craftinginterpreters.com/', description: '解释器实现教程', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'math-linear',
    skillName: '线性代数',
    aliases: ['math-linear', '线性代数', '矩阵', '向量空间', '特征值', 'AI数学基础'],
    category: '计算机基础',
    description: 'AI和图形学的数学基础',
    difficulty: '中等',
    estimatedTime: '2-3个月',
    prerequisites: [],
    relatedSkills: ['math-stats', 'machine-learning', 'deep-learning'],
    learningPath: [
      {
        phase: '线性代数',
        goal: '掌握矩阵运算与向量空间',
        resources: [
          { type: 'video', title: '3Blue1Brown线性代数', url: 'https://www.bilibili.com/video/BV1ys411472E', description: '线性代数本质(视频)', level: '入门', free: true },
          { type: 'book', title: '线性代数应该这样学', url: 'https://book.douban.com/subject/4182124/', description: '线性代数教材', level: '进阶', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'math-stats',
    skillName: '概率统计',
    aliases: ['math-stats', '概率论', '数理统计', '概率统计', '贝叶斯', '假设检验'],
    category: '计算机基础',
    description: '数据分析和AI的数学基础',
    difficulty: '中等',
    estimatedTime: '2-3个月',
    prerequisites: [],
    relatedSkills: ['math-linear', 'machine-learning', 'data-analysis'],
    learningPath: [
      {
        phase: '概率统计',
        goal: '掌握概率分布与统计推断',
        resources: [
          { type: 'video', title: '可汗学院统计学', url: 'https://www.bilibili.com/video/BV1Ux411W7Gx', description: '统计学视频课程', level: '入门', free: true },
          { type: 'book', title: '概率论与数理统计', url: 'https://book.douban.com/subject/2208213/', description: '浙大概率统计', level: '进阶', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'software-engineering',
    skillName: '软件工程',
    aliases: ['software-engineering', '软件工程', '开发流程', '需求分析', '软件测试', 'UML'],
    category: '计算机基础',
    description: '软件开发流程和方法论',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: [],
    relatedSkills: ['design-patterns', 'agile', 'requirement-analysis'],
    learningPath: [
      {
        phase: '工程方法',
        goal: '掌握软件生命周期与开发模型',
        resources: [
          { type: 'book', title: '构建之法', url: 'https://book.douban.com/subject/27062603/', description: '软件工程实践', level: '入门', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'computer-architecture',
    skillName: '计算机组成原理',
    aliases: ['computer-architecture', '计算机组成', 'CPU', '指令集', '硬件结构', '冯诺依曼'],
    category: '计算机基础',
    description: '硬件结构和指令系统',
    difficulty: '较难',
    estimatedTime: '2-3个月',
    prerequisites: ['digital-logic'],
    relatedSkills: ['digital-logic', 'operating-systems', 'c-lang'],
    learningPath: [
      {
        phase: '组成原理',
        goal: '掌握CPU、存储与指令系统',
        resources: [
          { type: 'book', title: '计算机组成原理', url: 'https://book.douban.com/subject/26886722/', description: '组成原理教材', level: '进阶', free: false },
          { type: 'video', title: 'CS61C课程', url: 'https://cs61c.org/', description: 'UC Berkeley计算机组成', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'digital-logic',
    skillName: '数字逻辑',
    aliases: ['digital-logic', '数字电路', '逻辑门', '布尔代数', '组合逻辑', '时序逻辑'],
    category: '计算机基础',
    description: '逻辑电路和数字系统设计',
    difficulty: '中等',
    estimatedTime: '1-2个月',
    prerequisites: [],
    relatedSkills: ['computer-architecture', 'embedded'],
    learningPath: [
      {
        phase: '数字逻辑',
        goal: '掌握逻辑门与电路设计',
        resources: [
          { type: 'book', title: '数字逻辑', url: 'https://book.douban.com/subject/1231234/', description: '数字逻辑教材', level: '入门', free: false },
        ],
      },
    ],
  },

  // ========== 网络安全类 ==========
  {
    skillId: 'network-security',
    skillName: '网络安全基础',
    aliases: ['network-security', '网络安全', '信息安全', '攻防', '安全防护', '等保'],
    category: '网络安全',
    description: '网络攻击与防御基础',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: ['networking', 'linux'],
    relatedSkills: ['web-security', 'cryptography', 'tcp-ip'],
    learningPath: [
      {
        phase: '安全基础',
        goal: '掌握网络安全原理与防护',
        resources: [
          { type: 'book', title: '网络安全评估', url: 'https://book.douban.com/subject/10790321/', description: '网络安全入门书籍', level: '入门', free: false },
          { type: 'practice', title: 'HackTheBox', url: 'https://www.hackthebox.com/', description: '在线靶场练习', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'web-security',
    skillName: 'Web安全',
    aliases: ['web-security', 'Web安全', 'OWASP', 'XSS', 'SQL注入', 'CSRF', 'Web攻防'],
    category: '网络安全',
    description: 'Web应用安全攻防，OWASP Top10',
    difficulty: '中等',
    estimatedTime: '2-3个月',
    prerequisites: ['network-security', 'javascript'],
    relatedSkills: ['network-security', 'penetration-testing', 'javascript'],
    learningPath: [
      {
        phase: 'Web漏洞',
        goal: '掌握OWASP Top10漏洞原理与防御',
        resources: [
          { type: 'doc', title: 'OWASP官方文档', url: 'https://owasp.org/www-project-top-ten/', description: 'OWASP Top 10', level: '入门', free: true },
          { type: 'practice', title: 'DVWA靶场', url: 'https://github.com/digininja/DVWA', description: 'Web漏洞练习平台', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'cryptography',
    skillName: '密码学',
    aliases: ['cryptography', '密码学', '加密', 'RSA', 'AES', '哈希', '对称加密'],
    category: '网络安全',
    description: '加密与解密技术',
    difficulty: '困难',
    estimatedTime: '2-4个月',
    prerequisites: ['math-stats'],
    relatedSkills: ['network-security', 'blockchain'],
    learningPath: [
      {
        phase: '密码学理论',
        goal: '掌握对称与非对称加密算法',
        resources: [
          { type: 'book', title: '密码学原理与实践', url: 'https://book.douban.com/subject/10841978/', description: '密码学经典教材', level: '高级', free: false },
          { type: 'doc', title: 'Crypto101', url: 'https://crypto101.io/', description: '密码学入门', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'penetration-testing',
    skillName: '渗透测试',
    aliases: ['penetration-testing', '渗透测试', 'Pentest', '红队', '漏洞利用', 'Metasploit'],
    category: '网络安全',
    description: '安全漏洞检测技术',
    difficulty: '较难',
    estimatedTime: '3-6个月',
    prerequisites: ['network-security', 'linux'],
    relatedSkills: ['web-security', 'network-security'],
    learningPath: [
      {
        phase: '渗透实战',
        goal: '掌握渗透测试流程与工具',
        resources: [
          { type: 'practice', title: 'TryHackMe', url: 'https://tryhackme.com/', description: '在线安全学习平台', level: '入门', free: true },
          { type: 'doc', title: 'Kali Linux文档', url: 'https://www.kali.org/docs/', description: '渗透测试系统文档', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'reverse-engineering',
    skillName: '逆向工程',
    aliases: ['reverse-engineering', '逆向工程', '逆向分析', '反汇编', 'GDB', 'IDA Pro'],
    category: '网络安全',
    description: '软件逆向分析和破解',
    difficulty: '困难',
    estimatedTime: '4-8个月',
    prerequisites: ['c-lang', 'cpp', 'operating-systems'],
    relatedSkills: ['cryptography', 'penetration-testing'],
    learningPath: [
      {
        phase: '逆向基础',
        goal: '掌握汇编与反汇编工具',
        resources: [
          { type: 'book', title: '逆向工程核心原理', url: 'https://book.douban.com/subject/25866357/', description: '逆向入门书籍', level: '进阶', free: false },
          { type: 'practice', title: 'CrackMe练习', url: 'https://crackmes.one/', description: '逆向练习题', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'security-ops',
    skillName: '安全运维',
    aliases: ['security-ops', 'SecOps', '安全运营', 'SOC', '应急响应', 'SIEM'],
    category: '网络安全',
    description: '安全运营和应急响应',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: ['network-security', 'linux'],
    relatedSkills: ['network-security', 'monitoring', 'linux'],
    learningPath: [
      {
        phase: '安全运营',
        goal: '掌握SIEM与应急响应流程',
        resources: [
          { type: 'doc', title: 'Splunk文档', url: 'https://docs.splunk.com/Documentation', description: 'SIEM平台文档', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'iot-security',
    skillName: '物联网安全',
    aliases: ['iot-security', 'IoT安全', '物联网安全', '固件分析', '设备安全'],
    category: '网络安全',
    description: 'IoT设备安全防护',
    difficulty: '较难',
    estimatedTime: '2-4个月',
    prerequisites: ['network-security', 'embedded'],
    relatedSkills: ['embedded', 'iot', 'network-security'],
    learningPath: [
      {
        phase: 'IoT安全',
        goal: '掌握固件分析与设备安全',
        resources: [
          { type: 'article', title: 'IoT安全入门', url: 'https://www.hackthebox.com/blog/iot-security', description: 'IoT安全指南', level: '进阶', free: true },
        ],
      },
    ],
  },

  // ========== 游戏开发类 ==========
  {
    skillId: 'unity',
    skillName: 'Unity',
    aliases: ['unity', 'Unity3D', 'Unity引擎', '游戏开发', 'C#游戏', 'Unity游戏'],
    category: '游戏开发',
    description: '最流行的跨平台游戏引擎',
    difficulty: '中等',
    estimatedTime: '3-6个月',
    prerequisites: ['csharp'],
    relatedSkills: ['csharp', 'shader', 'game-design'],
    learningPath: [
      {
        phase: '引擎入门',
        goal: '掌握Unity编辑器与C#脚本',
        resources: [
          { type: 'doc', title: 'Unity官方文档', url: 'https://docs.unity3d.com/cn/current/Manual/index.html', description: 'Unity官方中文文档', level: '入门', free: true },
          { type: 'practice', title: 'Unity Learn', url: 'https://learn.unity.com/', description: 'Unity官方学习平台', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'unreal',
    skillName: 'Unreal Engine',
    aliases: ['unreal', 'UE', 'UE5', '虚幻引擎', '3A游戏', '蓝图', 'Unreal'],
    category: '游戏开发',
    description: '3A游戏开发引擎',
    difficulty: '较难',
    estimatedTime: '4-8个月',
    prerequisites: ['cpp'],
    relatedSkills: ['cpp', 'shader', 'game-design'],
    learningPath: [
      {
        phase: '引擎入门',
        goal: '掌握UE编辑器与蓝图系统',
        resources: [
          { type: 'doc', title: 'Unreal官方文档', url: 'https://docs.unrealengine.com/5.0/zh-CN/', description: 'UE5中文文档', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'game-design',
    skillName: '游戏设计',
    aliases: ['game-design', '游戏设计', '关卡设计', '玩法设计', '游戏平衡', '游戏策划'],
    category: '游戏开发',
    description: '游戏玩法和关卡设计',
    difficulty: '简单',
    estimatedTime: '2-4个月',
    prerequisites: [],
    relatedSkills: ['unity', 'unreal', 'product-design'],
    learningPath: [
      {
        phase: '设计理论',
        goal: '掌握游戏设计原理与方法',
        resources: [
          { type: 'book', title: '游戏设计艺术', url: 'https://book.douban.com/subject/27088978/', description: '游戏设计经典', level: '入门', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'shader',
    skillName: 'Shader编程',
    aliases: ['shader', '着色器', 'GLSL', 'HLSL', 'CG', 'GPU编程', '渲染管线'],
    category: '游戏开发',
    description: 'GPU渲染和特效编程',
    difficulty: '较难',
    estimatedTime: '2-4个月',
    prerequisites: ['cpp', 'math-linear'],
    relatedSkills: ['unity', 'unreal', 'svg-canvas'],
    learningPath: [
      {
        phase: 'Shader入门',
        goal: '掌握着色器语言与渲染管线',
        resources: [
          { type: 'doc', title: 'ShaderToy', url: 'https://www.shadertoy.com/', description: '在线Shader创作平台', level: '进阶', free: true },
          { type: 'book', title: 'Unity Shader入门精要', url: 'https://book.douban.com/subject/26833492/', description: 'Unity Shader教程', level: '进阶', free: false },
        ],
      },
    ],
  },

  // ========== 区块链类 ==========
  {
    skillId: 'blockchain',
    skillName: '区块链基础',
    aliases: ['blockchain', '区块链', '分布式账本', '共识机制', '区块链原理', '链'],
    category: '区块链',
    description: '去中心化技术原理',
    difficulty: '较难',
    estimatedTime: '2-4个月',
    prerequisites: ['cryptography', 'networking'],
    relatedSkills: ['solidity', 'web3', 'cryptography'],
    learningPath: [
      {
        phase: '区块链原理',
        goal: '掌握共识机制与账本结构',
        resources: [
          { type: 'book', title: '区块链原理设计与应用', url: 'https://book.douban.com/subject/30177975/', description: '区块链入门书籍', level: '入门', free: false },
          { type: 'doc', title: '以太坊文档', url: 'https://ethereum.org/zh/developers/docs/', description: '以太坊开发者文档', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'solidity',
    skillName: 'Solidity',
    aliases: ['solidity', '智能合约', 'Solidity语言', '以太坊合约', 'EVM'],
    category: '区块链',
    description: '以太坊智能合约开发语言',
    difficulty: '较难',
    estimatedTime: '2-4个月',
    prerequisites: ['blockchain', 'javascript'],
    relatedSkills: ['blockchain', 'web3', 'javascript'],
    learningPath: [
      {
        phase: '合约开发',
        goal: '掌握Solidity语法与智能合约',
        resources: [
          { type: 'doc', title: 'Solidity官方文档', url: 'https://docs.soliditylang.org/zh/latest/', description: 'Solidity中文文档', level: '入门', free: true },
          { type: 'practice', title: 'CryptoZombies', url: 'https://cryptozombies.io/zh/', description: '游戏化学合约', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'web3',
    skillName: 'Web3开发',
    aliases: ['web3', 'Web3', 'DApp', '去中心化应用', 'Web3.js', 'ethers.js'],
    category: '区块链',
    description: '去中心化应用(DApp)开发',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: ['solidity', 'javascript'],
    relatedSkills: ['solidity', 'blockchain', 'javascript'],
    learningPath: [
      {
        phase: 'DApp开发',
        goal: '掌握Web3.js与DApp前端',
        resources: [
          { type: 'doc', title: 'Web3.js文档', url: 'https://web3js.readthedocs.io/', description: 'Web3.js官方文档', level: '进阶', free: true },
          { type: 'doc', title: 'ethers.js文档', url: 'https://docs.ethers.org/', description: 'ethers.js库文档', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'defi',
    skillName: 'DeFi',
    aliases: ['defi', 'DeFi', '去中心化金融', 'Uniswap', 'AMM', '流动性挖矿'],
    category: '区块链',
    description: '去中心化金融协议开发',
    difficulty: '较难',
    estimatedTime: '2-4个月',
    prerequisites: ['solidity', 'blockchain'],
    relatedSkills: ['solidity', 'web3', 'blockchain'],
    learningPath: [
      {
        phase: 'DeFi协议',
        goal: '掌握AMM与借贷协议原理',
        resources: [
          { type: 'doc', title: 'Uniswap文档', url: 'https://docs.uniswap.org/', description: 'Uniswap协议文档', level: '高级', free: true },
          { type: 'article', title: 'DeFi学习', url: 'https://defillama.com/', description: 'DeFi数据分析', level: '进阶', free: true },
        ],
      },
    ],
  },

  // ========== 嵌入式/物联网类 ==========
  {
    skillId: 'embedded',
    skillName: '嵌入式开发',
    aliases: ['embedded', '嵌入式', '单片机', 'STM32', 'ARM', '嵌入式系统', 'MCU'],
    category: '嵌入式/物联网',
    description: '单片机和嵌入式系统开发',
    difficulty: '较难',
    estimatedTime: '4-8个月',
    prerequisites: ['c-lang', 'computer-architecture'],
    relatedSkills: ['c-lang', 'arduino', 'iot', 'operating-systems'],
    learningPath: [
      {
        phase: '嵌入式基础',
        goal: '掌握单片机与裸机开发',
        resources: [
          { type: 'doc', title: 'STM32文档', url: 'https://www.st.com/zh/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html', description: 'STM32官方资源', level: '进阶', free: true },
          { type: 'book', title: 'Cortex-M3权威指南', url: 'https://book.douban.com/subject/4056783/', description: 'ARM嵌入式经典', level: '进阶', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'iot',
    skillName: '物联网',
    aliases: ['iot', '物联网', 'IoT', '物联网平台', 'MQTT', '智能家居'],
    category: '嵌入式/物联网',
    description: 'IoT设备开发和平台对接',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: ['embedded', 'networking'],
    relatedSkills: ['embedded', 'arduino', 'raspberry-pi'],
    learningPath: [
      {
        phase: 'IoT开发',
        goal: '掌握MQTT协议与IoT平台',
        resources: [
          { type: 'doc', title: 'MQTT文档', url: 'https://mqtt.org/', description: 'MQTT协议文档', level: '入门', free: true },
          { type: 'doc', title: '阿里云IoT', url: 'https://help.aliyun.com/product/30520.html', description: '阿里云物联网平台', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'arduino',
    skillName: 'Arduino',
    aliases: ['arduino', 'Arduino开发', '开源硬件', '创客', '电子制作'],
    category: '嵌入式/物联网',
    description: '开源硬件原型开发平台',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: [],
    relatedSkills: ['embedded', 'raspberry-pi', 'c-lang'],
    learningPath: [
      {
        phase: 'Arduino入门',
        goal: '掌握基础电路与编程',
        resources: [
          { type: 'doc', title: 'Arduino官方文档', url: 'https://www.arduino.cc/learn', description: 'Arduino官方教程', level: '入门', free: true },
          { type: 'practice', title: 'Tinkercad', url: 'https://www.tinkercad.com/', description: '在线电路仿真', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'raspberry-pi',
    skillName: '树莓派',
    aliases: ['raspberry-pi', '树莓派', 'Raspberry Pi', 'RPi', '卡片电脑', '创客'],
    category: '嵌入式/物联网',
    description: '卡片式电脑，创客项目首选',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: ['linux'],
    relatedSkills: ['arduino', 'embedded', 'linux'],
    learningPath: [
      {
        phase: '树莓派入门',
        goal: '掌握树莓派系统与GPIO编程',
        resources: [
          { type: 'doc', title: '树莓派官方文档', url: 'https://www.raspberrypi.com/documentation/', description: '树莓派官方文档', level: '入门', free: true },
        ],
      },
    ],
  },

  // ========== 移动开发类 ==========
  {
    skillId: 'flutter',
    skillName: 'Flutter',
    aliases: ['flutter', 'Dart', '跨平台移动', 'Flutter框架', 'Fuchsia', '移动跨端'],
    category: '移动开发',
    description: '跨平台移动应用开发框架',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: ['javascript'],
    relatedSkills: ['react-native', 'dart'],
    learningPath: [
      {
        phase: 'Flutter入门',
        goal: '掌握Widget与Dart语言',
        resources: [
          { type: 'doc', title: 'Flutter官方文档', url: 'https://docs.flutter.dev/', description: 'Flutter官方文档', level: '入门', free: true },
          { type: 'doc', title: 'Flutter中文文档', url: 'https://flutter.cn/', description: 'Flutter中文站', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'react-native',
    skillName: 'React Native',
    aliases: ['react-native', 'RN', 'React Native', '跨平台移动', 'RN开发'],
    category: '移动开发',
    description: 'React跨平台移动开发',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: ['react', 'javascript'],
    relatedSkills: ['react', 'javascript', 'flutter'],
    learningPath: [
      {
        phase: 'RN入门',
        goal: '掌握组件与原生模块',
        resources: [
          { type: 'doc', title: 'React Native官方文档', url: 'https://reactnative.dev/docs/getting-started', description: 'RN官方文档', level: '入门', free: true },
          { type: 'doc', title: 'RN中文文档', url: 'https://reactnative.cn/', description: 'RN中文文档', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'swift-ui',
    skillName: 'SwiftUI',
    aliases: ['swift-ui', 'SwiftUI', '声明式UI', 'Apple UI', 'iOS声明式'],
    category: '移动开发',
    description: 'Apple声明式UI框架',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: ['swift-lang'],
    relatedSkills: ['swift-lang', 'ios-dev'],
    learningPath: [
      {
        phase: 'SwiftUI入门',
        goal: '掌握声明式UI与视图组合',
        resources: [
          { type: 'doc', title: 'SwiftUI教程', url: 'https://developer.apple.com/tutorials/swiftui', description: 'Apple官方SwiftUI教程', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'jetpack',
    skillName: 'Jetpack Compose',
    aliases: ['jetpack', 'Compose', 'Jetpack Compose', 'Android声明式UI', '声明式Android'],
    category: '移动开发',
    description: 'Android现代声明式UI框架',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: ['kotlin', 'android-dev'],
    relatedSkills: ['kotlin', 'android-dev'],
    learningPath: [
      {
        phase: 'Compose入门',
        goal: '掌握声明式UI与状态管理',
        resources: [
          { type: 'doc', title: 'Jetpack Compose文档', url: 'https://developer.android.com/jetpack/compose?hl=zh-cn', description: 'Compose官方文档', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'ios-dev',
    skillName: 'iOS开发',
    aliases: ['ios-dev', 'iOS开发', 'iPhone开发', 'Swift iOS', 'iOS App', '苹果开发'],
    category: '移动开发',
    description: 'Apple移动应用开发',
    difficulty: '中等',
    estimatedTime: '3-6个月',
    prerequisites: ['swift-lang'],
    relatedSkills: ['swift-lang', 'swift-ui'],
    learningPath: [
      {
        phase: 'iOS开发入门',
        goal: '掌握iOS应用结构与生命周期',
        resources: [
          { type: 'doc', title: 'Apple开发者文档', url: 'https://developer.apple.com/develop/', description: 'Apple开发资源', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'android-dev',
    skillName: 'Android开发',
    aliases: ['android-dev', 'Android开发', '安卓开发', 'Android App', 'Android SDK'],
    category: '移动开发',
    description: 'Android原生应用开发',
    difficulty: '中等',
    estimatedTime: '3-6个月',
    prerequisites: ['kotlin', 'java'],
    relatedSkills: ['kotlin', 'jetpack', 'java'],
    learningPath: [
      {
        phase: 'Android入门',
        goal: '掌握Activity、布局与组件',
        resources: [
          { type: 'doc', title: 'Android开发者文档', url: 'https://developer.android.com/?hl=zh-cn', description: 'Android官方中文文档', level: '入门', free: true },
        ],
      },
    ],
  },

  // ========== 产品设计类 ==========
  {
    skillId: 'product-design',
    skillName: '产品设计',
    aliases: ['product-design', '产品设计', '产品规划', '功能设计', '产品思维'],
    category: '产品设计',
    description: '产品需求分析和功能设计',
    difficulty: '简单',
    estimatedTime: '2-4个月',
    prerequisites: [],
    relatedSkills: ['ux-design', 'requirement-analysis', 'agile'],
    learningPath: [
      {
        phase: '产品设计方法',
        goal: '掌握产品设计与需求分析',
        resources: [
          { type: 'book', title: '启示录', url: 'https://book.douban.com/subject/5920732/', description: '产品管理经典', level: '入门', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'ui-design',
    skillName: 'UI设计',
    aliases: ['ui-design', 'UI设计', '界面设计', '视觉设计', 'UI规范', '设计系统'],
    category: '产品设计',
    description: '用户界面视觉设计',
    difficulty: '简单',
    estimatedTime: '2-4个月',
    prerequisites: [],
    relatedSkills: ['figma', 'ux-design', 'html-css'],
    learningPath: [
      {
        phase: 'UI设计基础',
        goal: '掌握视觉设计与规范',
        resources: [
          { type: 'doc', title: 'Material Design', url: 'https://m3.material.io/', description: '谷歌设计规范', level: '入门', free: true },
          { type: 'doc', title: 'Apple HIG', url: 'https://developer.apple.com/design/human-interface-guidelines/', description: '苹果设计指南', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'ux-design',
    skillName: 'UX设计',
    aliases: ['ux-design', 'UX设计', '用户体验', '交互设计', '用户研究', '可用性'],
    category: '产品设计',
    description: '用户体验研究和交互设计',
    difficulty: '简单',
    estimatedTime: '2-4个月',
    prerequisites: [],
    relatedSkills: ['ui-design', 'product-design', 'communication'],
    learningPath: [
      {
        phase: 'UX方法论',
        goal: '掌握用户研究与交互设计',
        resources: [
          { type: 'book', title: '用户体验要素', url: 'https://book.douban.com/subject/2271025/', description: 'UX经典书籍', level: '入门', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'figma',
    skillName: 'Figma',
    aliases: ['figma', 'Figma设计', '在线设计工具', '协作设计', 'UI工具'],
    category: '产品设计',
    description: '在线UI设计协作工具',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: [],
    relatedSkills: ['ui-design', 'ux-design'],
    learningPath: [
      {
        phase: 'Figma工具',
        goal: '掌握Figma设计与协作',
        resources: [
          { type: 'doc', title: 'Figma官方文档', url: 'https://help.figma.com/hc/en-us', description: 'Figma官方帮助', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'agile',
    skillName: '敏捷开发',
    aliases: ['agile', '敏捷开发', 'Scrum', 'Kanban', '看板', '敏捷', 'Sprint'],
    category: '产品设计',
    description: 'Scrum/Kanban项目管理方法',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: [],
    relatedSkills: ['project-management', 'software-engineering'],
    learningPath: [
      {
        phase: '敏捷方法',
        goal: '掌握Scrum与敏捷实践',
        resources: [
          { type: 'book', title: 'Scrum敏捷软件开发', url: 'https://book.douban.com/subject/5337399/', description: 'Scrum经典', level: '入门', free: false },
          { type: 'doc', title: 'Scrum指南', url: 'https://scrumguides.org/scrum-guide.html', description: 'Scrum官方指南', level: '入门', free: true },
        ],
      },
    ],
  },

  // ========== 软技能类 ==========
  {
    skillId: 'tech-writing',
    skillName: '技术写作',
    aliases: ['tech-writing', '技术写作', '技术文档', '技术博客', '文档编写', 'README'],
    category: '软技能',
    description: '文档编写和技术博客',
    difficulty: '入门',
    estimatedTime: '2-4周',
    prerequisites: [],
    relatedSkills: ['communication', 'english'],
    learningPath: [
      {
        phase: '写作技巧',
        goal: '掌握技术文档写作规范',
        resources: [
          { type: 'doc', title: '技术文档写作指南', url: 'https://developers.google.com/tech-writing?hl=zh-cn', description: 'Google技术写作课程', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'communication',
    skillName: '沟通协作',
    aliases: ['communication', '沟通', '协作', '团队沟通', '跨部门协作', '表达'],
    category: '软技能',
    description: '团队沟通和跨部门协作',
    difficulty: '入门',
    estimatedTime: '1-2个月',
    prerequisites: [],
    relatedSkills: ['tech-writing', 'problem-solving'],
    learningPath: [
      {
        phase: '沟通方法',
        goal: '掌握高效沟通技巧',
        resources: [
          { type: 'book', title: '非暴力沟通', url: 'https://book.douban.com/subject/35332278/', description: '沟通经典书籍', level: '入门', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'problem-solving',
    skillName: '问题解决',
    aliases: ['problem-solving', '问题解决', '系统思考', '逻辑思维', '分析能力', '批判性思维'],
    category: '软技能',
    description: '系统性分析和解决问题',
    difficulty: '简单',
    estimatedTime: '1-2个月',
    prerequisites: [],
    relatedSkills: ['communication', 'algorithms'],
    learningPath: [
      {
        phase: '思维方法',
        goal: '掌握结构化问题解决方法',
        resources: [
          { type: 'book', title: '思考快与慢', url: 'https://book.douban.com/subject/10785583/', description: '思维与决策经典', level: '进阶', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'english',
    skillName: '技术英语',
    aliases: ['english', '技术英语', '英文文档', '英语阅读', '英文论文', '编程英语'],
    category: '软技能',
    description: '阅读英文文档和论文',
    difficulty: '简单',
    estimatedTime: '3-6个月',
    prerequisites: [],
    relatedSkills: ['tech-writing'],
    learningPath: [
      {
        phase: '技术英语',
        goal: '掌握技术文档英语阅读能力',
        resources: [
          { type: 'practice', title: 'MIT OCW', url: 'https://ocw.mit.edu/', description: 'MIT开放课程', level: '进阶', free: true },
          { type: 'doc', title: '技术英语词汇', url: 'https://developer.mozilla.org/zh-CN/docs/Glossary', description: 'MDN术语表', level: '入门', free: true },
        ],
      },
    ],
  },

  // ========== 网络工程类 ==========
  {
    skillId: 'tcp-ip',
    skillName: 'TCP/IP协议',
    aliases: ['tcp-ip', 'TCP/IP', '协议栈', 'TCP协议', 'IP协议', '网络协议', 'OSI'],
    category: '网络工程',
    description: '网络通信核心协议栈',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: ['networking'],
    relatedSkills: ['networking', 'routing-switching', 'linux'],
    learningPath: [
      {
        phase: '协议原理',
        goal: '掌握TCP/IP各层协议',
        resources: [
          { type: 'book', title: 'TCP/IP详解', url: 'https://book.douban.com/subject/1088054/', description: 'TCP/IP经典书籍', level: '进阶', free: false },
          { type: 'article', title: 'TCP/IP教程', url: 'https://www.runoob.com/tcpip/tcpip-tutorial.html', description: 'TCP/IP入门教程', level: '入门', free: true },
        ],
      },
      {
        phase: '抓包分析',
        goal: '掌握Wireshark抓包与协议分析',
        resources: [
          { type: 'doc', title: 'Wireshark文档', url: 'https://www.wireshark.org/docs/', description: 'Wireshark抓包工具', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'routing-switching',
    skillName: '路由与交换',
    aliases: ['routing-switching', '路由交换', '路由器', '交换机', '华为', '思科', 'CCNA', 'HCIA'],
    category: '网络工程',
    description: '网络设备配置与管理',
    difficulty: '中等',
    estimatedTime: '3-6个月',
    prerequisites: ['tcp-ip', 'networking'],
    relatedSkills: ['tcp-ip', 'network-design', 'vlan-stp'],
    learningPath: [
      {
        phase: '路由交换基础',
        goal: '掌握路由协议与交换技术',
        resources: [
          { type: 'doc', title: '华为IP网络文档', url: 'https://support.huawei.com/enterprise/zh/doc/index.html', description: '华为网络设备文档', level: '进阶', free: true },
          { type: 'practice', title: 'eNSP模拟器', url: 'https://forum.huawei.com/enterprise/zh/thread/5808904d570b4d9990e69c8a4a09b0a3', description: '华为网络模拟器', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'network-design',
    skillName: '网络规划设计',
    aliases: ['network-design', '网络设计', '网络架构', '拓扑设计', '网络规划', '网络方案'],
    category: '网络工程',
    description: '企业网络拓扑设计',
    difficulty: '中等',
    estimatedTime: '2-4个月',
    prerequisites: ['routing-switching', 'system-design'],
    relatedSkills: ['routing-switching', 'tcp-ip', 'system-design'],
    learningPath: [
      {
        phase: '网络架构',
        goal: '掌握企业网络设计与规划',
        resources: [
          { type: 'book', title: '网络规划设计', url: 'https://book.douban.com/subject/1234567/', description: '网络设计方法论', level: '进阶', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'dns-dhcp',
    skillName: 'DNS/DHCP',
    aliases: ['dns-dhcp', 'DNS', 'DHCP', '域名解析', '动态主机配置', '域名服务'],
    category: '网络工程',
    description: '域名解析和地址分配服务',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: ['tcp-ip', 'linux'],
    relatedSkills: ['tcp-ip', 'linux', 'network-design'],
    learningPath: [
      {
        phase: 'DNS与DHCP服务',
        goal: '掌握域名解析与地址分配配置',
        resources: [
          { type: 'doc', title: 'BIND文档', url: 'https://bind9.readthedocs.io/', description: 'BIND DNS服务器文档', level: '进阶', free: true },
          { type: 'article', title: 'DNS教程', url: 'https://www.runoob.com/w3cnote/linux-dns-setting.html', description: 'Linux DNS配置', level: '入门', free: true },
        ],
      },
    ],
  },

  // ========== IT运维类 ==========
  {
    skillId: 'server-hardware',
    skillName: '服务器硬件',
    aliases: ['server-hardware', '服务器', '服务器硬件', '机架式服务器', '刀片服务器', '服务器选型'],
    category: 'IT运维',
    description: '服务器选型和维护',
    difficulty: '简单',
    estimatedTime: '1-2个月',
    prerequisites: ['linux'],
    relatedSkills: ['storage-system', 'virtualization', 'linux'],
    learningPath: [
      {
        phase: '硬件基础',
        goal: '掌握服务器硬件架构与维护',
        resources: [
          { type: 'doc', title: '戴尔服务器文档', url: 'https://www.dell.com/support/home/zh-cn', description: '戴尔服务器支持', level: '入门', free: true },
          { type: 'article', title: '服务器教程', url: 'https://www.runoob.com/w3cnote/server-hardware.html', description: '服务器硬件基础', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'storage-system',
    skillName: '存储系统',
    aliases: ['storage-system', '存储', 'SAN', 'NAS', '磁盘阵列', 'RAID', '分布式存储'],
    category: 'IT运维',
    description: '磁盘阵列和存储架构',
    difficulty: '中等',
    estimatedTime: '2-3个月',
    prerequisites: ['server-hardware', 'linux'],
    relatedSkills: ['server-hardware', 'backup-recovery', 'virtualization'],
    learningPath: [
      {
        phase: '存储架构',
        goal: '掌握RAID、SAN、NAS存储技术',
        resources: [
          { type: 'article', title: '存储技术教程', url: 'https://www.runoob.com/w3cnote/storage-technology.html', description: '存储系统基础', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'backup-recovery',
    skillName: '备份与恢复',
    aliases: ['backup-recovery', '数据备份', '灾难恢复', '容灾', '数据恢复', 'BCP'],
    category: 'IT运维',
    description: '数据备份和灾难恢复',
    difficulty: '中等',
    estimatedTime: '1-2个月',
    prerequisites: ['linux', 'storage-system'],
    relatedSkills: ['storage-system', 'linux', 'monitoring'],
    learningPath: [
      {
        phase: '备份策略',
        goal: '掌握数据备份与灾难恢复方案',
        resources: [
          { type: 'doc', title: 'Veeam文档', url: 'https://helpcenter.veeam.com/', description: 'Veeam备份方案', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'virtualization',
    skillName: '虚拟化技术',
    aliases: ['virtualization', '虚拟化', 'VMware', 'KVM', 'Hyper-V', 'vSphere', '虚拟机'],
    category: 'IT运维',
    description: 'VMware/KVM虚拟化平台',
    difficulty: '中等',
    estimatedTime: '2-3个月',
    prerequisites: ['linux', 'server-hardware'],
    relatedSkills: ['docker', 'kubernetes', 'storage-system'],
    learningPath: [
      {
        phase: '虚拟化平台',
        goal: '掌握VMware与KVM虚拟化',
        resources: [
          { type: 'doc', title: 'VMware文档', url: 'https://docs.vmware.com/', description: 'VMware官方文档', level: '进阶', free: true },
          { type: 'doc', title: 'KVM文档', url: 'https://www.linux-kvm.org/page/Documents', description: 'KVM虚拟化文档', level: '进阶', free: true },
        ],
      },
    ],
  },

  // ========== 项目管理类 ==========
  {
    skillId: 'project-management',
    skillName: '项目管理',
    aliases: ['project-management', '项目管理', 'PMP', 'PMO', '项目管理方法论', 'PMBOK'],
    category: '项目管理',
    description: 'PMP项目管理方法论',
    difficulty: '简单',
    estimatedTime: '2-4个月',
    prerequisites: [],
    relatedSkills: ['risk-management', 'schedule-management', 'agile'],
    learningPath: [
      {
        phase: '项目管理方法',
        goal: '掌握PMBOK十大知识领域',
        resources: [
          { type: 'book', title: 'PMBOK指南', url: 'https://book.douban.com/subject/27082638/', description: 'PMP官方教材', level: '入门', free: false },
          { type: 'doc', title: 'PMI官方', url: 'https://www.pmi.org/', description: 'PMI项目管理协会', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'risk-management',
    skillName: '风险管理',
    aliases: ['risk-management', '风险管理', '风险识别', '风险应对', '风险评估', '风险控制'],
    category: '项目管理',
    description: '项目风险识别与控制',
    difficulty: '简单',
    estimatedTime: '1-2个月',
    prerequisites: ['project-management'],
    relatedSkills: ['project-management', 'requirement-analysis'],
    learningPath: [
      {
        phase: '风险管理方法',
        goal: '掌握风险识别、评估与应对',
        resources: [
          { type: 'book', title: '项目风险管理', url: 'https://book.douban.com/subject/3013235/', description: '风险管理书籍', level: '入门', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'requirement-analysis',
    skillName: '需求分析',
    aliases: ['requirement-analysis', '需求分析', '需求工程', '需求管理', '用户故事', 'PRD'],
    category: '项目管理',
    description: '需求收集与分析方法',
    difficulty: '简单',
    estimatedTime: '1-2个月',
    prerequisites: [],
    relatedSkills: ['project-management', 'product-design', 'communication'],
    learningPath: [
      {
        phase: '需求分析方法',
        goal: '掌握需求收集、分析与文档编写',
        resources: [
          { type: 'book', title: '需求工程', url: 'https://book.douban.com/subject/26382782/', description: '软件需求工程', level: '入门', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'schedule-management',
    skillName: '进度管理',
    aliases: ['schedule-management', '进度管理', '项目进度', '甘特图', '时间管理', '里程碑'],
    category: '项目管理',
    description: '项目时间规划和控制',
    difficulty: '简单',
    estimatedTime: '1-2个月',
    prerequisites: ['project-management'],
    relatedSkills: ['project-management', 'risk-management', 'agile'],
    learningPath: [
      {
        phase: '进度控制方法',
        goal: '掌握项目进度规划与跟踪',
        resources: [
          { type: 'doc', title: '甘特图工具', url: 'https://www.runoob.com/project-management/gantt-chart.html', description: '甘特图制作', level: '入门', free: true },
        ],
      },
    ],
  },

  {
    skillId: 'sql',
    skillName: 'SQL',
    aliases: ['sql', '结构化查询语言', 'SQL语句', '数据库查询', '增删改查', 'CRUD'],
    category: '数据库',
    description: '数据库查询语言，数据操作必备',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: [],
    relatedSkills: ['mysql', 'postgresql', 'mongodb'],
    learningPath: [
      {
        phase: 'SQL基础',
        goal: '掌握SELECT、INSERT、UPDATE、DELETE与多表查询',
        resources: [
          { type: 'article', title: '菜鸟教程 SQL', url: 'https://www.runoob.com/sql/sql-tutorial.html', description: 'SQL入门教程', level: '入门', free: true },
          { type: 'practice', title: 'SQLZoo练习', url: 'https://sqlzoo.net/', description: '在线SQL交互练习', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶查询',
        goal: '掌握聚合函数、子查询、窗口函数与索引优化',
        resources: [
          { type: 'doc', title: 'W3Schools SQL', url: 'https://www.w3schools.com/sql/', description: 'SQL参考手册', level: '进阶', free: true },
          { type: 'practice', title: 'LeetCode数据库题', url: 'https://leetcode.cn/problemset/database/', description: 'SQL刷题练习', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'huggingface',
    skillName: 'Hugging Face',
    aliases: ['huggingface', 'Hugging Face', 'Transformers', 'HF', 'NLP库', 'AI模型库'],
    category: '人工智能',
    description: 'AI模型库和工具生态',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: ['python', 'nlp'],
    relatedSkills: ['llm', 'langchain', 'pytorch'],
    learningPath: [
      {
        phase: 'Transformers基础',
        goal: '掌握Pipeline、Tokenizer、模型加载与推理',
        resources: [
          { type: 'doc', title: 'HuggingFace官方教程', url: 'https://huggingface.co/learn', description: 'HuggingFace学习课程', level: '入门', free: true },
          { type: 'doc', title: 'Transformers文档', url: 'https://huggingface.co/docs/transformers/index', description: 'Transformers库官方文档', level: '入门', free: true },
        ],
      },
      {
        phase: '模型部署',
        goal: '掌握模型微调、Gradio demo与Hub上传',
        resources: [
          { type: 'doc', title: 'HuggingFace Hub文档', url: 'https://huggingface.co/docs/hub/index', description: '模型Hub使用指南', level: '进阶', free: true },
          { type: 'practice', title: 'Spaces示例', url: 'https://huggingface.co/spaces', description: '在线部署AI应用', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'network-troubleshooting',
    skillName: '网络故障排查',
    aliases: ['network-troubleshooting', '网络故障排查', '网络排错', '网络诊断', 'ping', 'traceroute'],
    category: '网络工程',
    description: '网络问题诊断与解决',
    difficulty: '中等',
    estimatedTime: '1-2个月',
    prerequisites: ['tcp-ip', 'routing-switching'],
    relatedSkills: ['networking', 'linux', 'network-monitoring'],
    learningPath: [
      {
        phase: '排查工具',
        goal: '掌握ping、traceroute、tcpdump、Wireshark抓包分析',
        resources: [
          { type: 'doc', title: 'Wireshark官方文档', url: 'https://www.wireshark.org/docs/', description: 'Wireshark抓包分析文档', level: '入门', free: true },
          { type: 'article', title: 'TCP/IP教程', url: 'https://www.runoob.com/tcpip/tcpip-tutorial.html', description: 'TCP/IP基础与网络排错', level: '入门', free: true },
        ],
      },
      {
        phase: '实战排错',
        goal: '掌握分层排查法、环路检测与故障定位',
        resources: [
          { type: 'doc', title: '华为故障处理指南', url: 'https://support.huawei.com/enterprise/zh/doc/index.html', description: '华为网络设备故障处理', level: '进阶', free: true },
          { type: 'practice', title: 'GNS3模拟实验', url: 'https://www.gns3.com/', description: '网络拓扑模拟与排错', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'vpn-firewall',
    skillName: 'VPN与防火墙',
    aliases: ['vpn-firewall', 'VPN', '防火墙', 'Firewall', 'IPSec', 'SSL VPN', '安全策略', 'ACL'],
    category: '网络工程',
    description: '网络安全设备配置',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: ['tcp-ip', 'linux'],
    relatedSkills: ['network-security', 'networking', 'routing-switching'],
    learningPath: [
      {
        phase: 'VPN技术',
        goal: '掌握IPSec、SSL VPN原理与配置',
        resources: [
          { type: 'article', title: 'Linux iptables教程', url: 'https://www.runoob.com/linux/linux-comm-iptables.html', description: 'Linux防火墙与NAT配置', level: '入门', free: true },
          { type: 'doc', title: '华为VPN文档', url: 'https://support.huawei.com/enterprise/zh/doc/index.html', description: '华为VPN配置指南', level: '进阶', free: true },
        ],
      },
      {
        phase: '防火墙配置',
        goal: '掌握防火墙策略、NAT与区域配置',
        resources: [
          { type: 'doc', title: 'OpenVPN文档', url: 'https://openvpn.net/community-resources/', description: 'OpenVPN开源VPN文档', level: '进阶', free: true },
          { type: 'doc', title: 'Cisco安全文档', url: 'https://www.cisco.com/c/en/us/support/security/index.html', description: 'Cisco安全产品文档', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'wireless-network',
    skillName: '无线网络',
    aliases: ['wireless-network', '无线网络', 'WiFi', 'WLAN', '802.11', '无线AP', 'WiFi6', '射频'],
    category: '网络工程',
    description: 'WiFi网络规划与优化',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: ['tcp-ip'],
    relatedSkills: ['networking', 'network-design', 'network-troubleshooting'],
    learningPath: [
      {
        phase: '无线基础',
        goal: '掌握802.11标准、信道、频段与覆盖规划',
        resources: [
          { type: 'article', title: '无线网络技术', url: 'https://www.tutorialspoint.com/data_communication_computer_network/network_lan_technologies.htm', description: '无线LAN技术介绍', level: '入门', free: true },
          { type: 'doc', title: '华为WLAN文档', url: 'https://support.huawei.com/enterprise/zh/wlan/index.html', description: '华为无线产品文档', level: '入门', free: true },
        ],
      },
      {
        phase: '部署优化',
        goal: '掌握AP部署、漫游优化与无线安全',
        resources: [
          { type: 'doc', title: 'Cisco无线设计指南', url: 'https://www.cisco.com/c/en/us/solutions/enterprise-networks/wireless/index.html', description: 'Cisco无线解决方案', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'network-monitoring',
    skillName: '网络监控',
    aliases: ['network-monitoring', '网络监控', 'SNMP', '网络性能监控', 'Zabbix', 'Nagios', '网络运维'],
    category: '网络工程',
    description: '网络性能监控与分析',
    difficulty: '简单',
    estimatedTime: '2-4周',
    prerequisites: ['linux', 'networking'],
    relatedSkills: ['monitoring', 'network-troubleshooting', 'network-design'],
    learningPath: [
      {
        phase: '监控协议',
        goal: '掌握SNMP、NetFlow、Syslog等监控协议',
        resources: [
          { type: 'doc', title: 'Zabbix官方文档', url: 'https://www.zabbix.com/documentation', description: 'Zabbix监控平台文档', level: '入门', free: true },
          { type: 'article', title: '网络协议基础', url: 'https://www.runoob.com/tcpip/tcpip-tutorial.html', description: 'TCP/IP与SNMP协议基础', level: '入门', free: true },
        ],
      },
      {
        phase: '监控平台',
        goal: '掌握Zabbix/Nagios部署与告警配置',
        resources: [
          { type: 'doc', title: 'Nagios文档', url: 'https://www.nagios.org/documentation/', description: 'Nagios监控文档', level: '进阶', free: true },
          { type: 'practice', title: 'Cacti监控实践', url: 'https://www.cacti.net/', description: '网络流量监控工具', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'isp-bgp',
    skillName: 'BGP/ISP技术',
    aliases: ['isp-bgp', 'BGP', 'ISP', '运营商网络', '自治系统', 'AS', 'BGP路由', '互联网骨干'],
    category: '网络工程',
    description: '运营商级网络技术',
    difficulty: '困难',
    estimatedTime: '3-6个月',
    prerequisites: ['ospf-bgp', 'routing-switching'],
    relatedSkills: ['ospf-bgp', 'network-design', 'sdn'],
    learningPath: [
      {
        phase: 'BGP协议',
        goal: '掌握BGP路径属性、路由策略与反射器',
        resources: [
          { type: 'doc', title: '华为BGP文档', url: 'https://support.huawei.com/enterprise/zh/doc/index.html', description: '华为BGP配置指南', level: '进阶', free: true },
          { type: 'book', title: 'BGP设计与实现', url: 'https://book.douban.com/subject/30177975/', description: 'BGP协议深入解析', level: '高级', free: false },
        ],
      },
      {
        phase: 'ISP运营',
        goal: '掌握骨干网架构、互联与流量工程',
        resources: [
          { type: 'doc', title: 'Cisco网络设计', url: 'https://www.cisco.com/c/en/us/solutions/enterprise-networks/index.html', description: 'Cisco网络设计指南', level: '高级', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'sdn',
    skillName: 'SDN软件定义网络',
    aliases: ['sdn', 'SDN', '软件定义网络', 'OpenFlow', '控制器', '网络虚拟化', '可编程网络'],
    category: '网络工程',
    description: '新型网络架构技术',
    difficulty: '较难',
    estimatedTime: '2-4个月',
    prerequisites: ['networking', 'linux'],
    relatedSkills: ['network-design', 'cloud-aws', 'virtualization'],
    learningPath: [
      {
        phase: 'SDN原理',
        goal: '掌握控制与转发分离、OpenFlow协议与控制器架构',
        resources: [
          { type: 'doc', title: 'ONF OpenFlow文档', url: 'https://opennetworking.org/software-defined-standards/specifications/', description: 'OpenFlow标准规范', level: '进阶', free: true },
          { type: 'doc', title: 'SDN架构介绍', url: 'https://www.opennetworking.org/sdn-definition/', description: 'SDN官方定义与架构介绍', level: '入门', free: true },
        ],
      },
      {
        phase: '控制器实践',
        goal: '掌握OpenDaylight、ONOS或RYU控制器',
        resources: [
          { type: 'doc', title: 'RYU控制器文档', url: 'https://ryu.readthedocs.io/', description: 'RYU SDN控制器文档', level: '进阶', free: true },
          { type: 'practice', title: 'Mininet实验', url: 'https://mininet.org/', description: 'SDN网络仿真平台', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'ospf-bgp',
    skillName: 'OSPF/BGP路由协议',
    aliases: ['ospf-bgp', 'OSPF', 'BGP', '动态路由', '路由协议', '链路状态', '距离矢量', 'IGP'],
    category: '网络工程',
    description: '动态路由协议，大型网络核心',
    difficulty: '较难',
    estimatedTime: '2-4个月',
    prerequisites: ['routing-switching', 'tcp-ip'],
    relatedSkills: ['routing-switching', 'vlan-stp', 'isp-bgp'],
    learningPath: [
      {
        phase: 'OSPF协议',
        goal: '掌握OSPF区域、LSA类型与邻居建立',
        resources: [
          { type: 'article', title: '网络协议教程', url: 'https://www.tutorialspoint.com/data_communication_computer_network/computer_network_types.htm', description: 'OSPF等路由协议详解', level: '入门', free: true },
          { type: 'doc', title: '华为OSPF文档', url: 'https://support.huawei.com/enterprise/zh/doc/index.html', description: '华为OSPF配置指南', level: '进阶', free: true },
        ],
      },
      {
        phase: 'BGP协议',
        goal: '掌握BGP邻居状态、路径属性与路由策略',
        resources: [
          { type: 'doc', title: 'Cisco网络协议文档', url: 'https://www.cisco.com/c/en/us/support/ip/index.html', description: 'Cisco路由协议文档', level: '进阶', free: true },
          { type: 'practice', title: 'EVE-NG模拟', url: 'https://www.eve-ng.net/', description: '网络虚拟化实验平台', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'vlan-stp',
    skillName: 'VLAN/STP',
    aliases: ['vlan-stp', 'VLAN', 'STP', '生成树', '虚拟局域网', 'Trunk', 'VTP', '环路避免'],
    category: '网络工程',
    description: '虚拟局域网和生成树协议',
    difficulty: '中等',
    estimatedTime: '2-4周',
    prerequisites: ['routing-switching', 'tcp-ip'],
    relatedSkills: ['routing-switching', 'network-design', 'ospf-bgp'],
    learningPath: [
      {
        phase: 'VLAN技术',
        goal: '掌握VLAN划分、Trunk、VTP与私有VLAN',
        resources: [
          { type: 'article', title: 'VLAN基础', url: 'https://www.tutorialspoint.com/data_communication_computer_network/network_lan_technologies.htm', description: 'VLAN基础与配置', level: '入门', free: true },
          { type: 'doc', title: '华为VLAN文档', url: 'https://support.huawei.com/enterprise/zh/doc/index.html', description: '华为VLAN配置指南', level: '入门', free: true },
        ],
      },
      {
        phase: '生成树协议',
        goal: '掌握STP/RSTP/MSTP原理与收敛优化',
        resources: [
          { type: 'doc', title: 'Cisco生成树文档', url: 'https://www.cisco.com/c/en/us/support/lan-switching/spanning-tree-protocol/tsd-products-support-protocol-home.html', description: 'Cisco生成树协议指南', level: '进阶', free: true },
          { type: 'practice', title: 'Packet Tracer实验', url: 'https://www.netacad.com/courses/packet-tracer', description: 'Cisco网络模拟实验', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'qos',
    skillName: 'QoS服务质量',
    aliases: ['qos', 'QoS', '服务质量', '流量工程', '拥塞管理', '流量整形', '优先级', 'DiffServ'],
    category: '网络工程',
    description: '流量工程和服务质量保障',
    difficulty: '较难',
    estimatedTime: '1-2个月',
    prerequisites: ['routing-switching', 'tcp-ip'],
    relatedSkills: ['network-design', 'vlan-stp', 'network-monitoring'],
    learningPath: [
      {
        phase: 'QoS基础',
        goal: '掌握分类、标记、拥塞管理与拥塞避免',
        resources: [
          { type: 'article', title: '网络基础教程', url: 'https://www.tutorialspoint.com/data_communication_computer_network/index.htm', description: 'QoS基础概念与模型', level: '入门', free: true },
          { type: 'doc', title: '华为QoS文档', url: 'https://support.huawei.com/enterprise/zh/doc/index.html', description: '华为QoS配置指南', level: '进阶', free: true },
        ],
      },
      {
        phase: '流量工程',
        goal: '掌握流量监管、整形与MPLS TE',
        resources: [
          { type: 'doc', title: 'Cisco网络设计', url: 'https://www.cisco.com/c/en/us/solutions/enterprise-networks/index.html', description: 'Cisco网络设计指南', level: '高级', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'windows-server',
    skillName: 'Windows Server',
    aliases: ['windows-server', 'Windows Server', 'WinServer', 'AD', 'Active Directory', '域控', 'IIS', 'Windows服务器'],
    category: 'IT运维',
    description: '微软服务器操作系统',
    difficulty: '简单',
    estimatedTime: '1-2个月',
    prerequisites: [],
    relatedSkills: ['linux', 'virtualization', 'networking'],
    learningPath: [
      {
        phase: '系统管理',
        goal: '掌握安装、用户管理、NTFS权限与服务配置',
        resources: [
          { type: 'doc', title: 'Windows Server官方文档', url: 'https://learn.microsoft.com/zh-cn/windows-server/', description: '微软Windows Server文档', level: '入门', free: true },
          { type: 'article', title: '服务器硬件基础', url: 'https://www.runoob.com/w3cnote/server-hardware.html', description: '服务器硬件与系统入门', level: '入门', free: true },
        ],
      },
      {
        phase: '活动目录',
        goal: '掌握AD域服务、组策略与DNS集成',
        resources: [
          { type: 'doc', title: 'Active Directory文档', url: 'https://learn.microsoft.com/zh-cn/windows-server/identity/active-directory-domain-services/', description: 'AD域服务官方文档', level: '进阶', free: true },
          { type: 'practice', title: 'Windows Server实验', url: 'https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server', description: '官方评估版下载与实验', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'it-service-management',
    skillName: 'IT服务管理',
    aliases: ['it-service-management', 'IT服务管理', 'ITIL', 'ITSM', '服务台', 'SLA', '服务生命周期'],
    category: 'IT运维',
    description: 'ITIL服务管理流程',
    difficulty: '简单',
    estimatedTime: '1-2个月',
    prerequisites: [],
    relatedSkills: ['helpdesk', 'project-management', 'asset-management'],
    learningPath: [
      {
        phase: 'ITIL基础',
        goal: '掌握服务战略、设计、转换、运营与持续改进',
        resources: [
          { type: 'doc', title: 'ITIL官方指南', url: 'https://www.axelos.com/best-practice-solutions/itil', description: 'AXELOS ITIL官方资源', level: '入门', free: true },
        ],
      },
      {
        phase: '流程实践',
        goal: '掌握事件管理、问题管理、变更管理与发布管理',
        resources: [
          { type: 'doc', title: 'ServiceNow文档', url: 'https://docs.servicenow.com/', description: 'ITSM平台文档', level: '进阶', free: true },
          { type: 'book', title: 'ITIL服务管理', url: 'https://book.douban.com/subject/30177975/', description: 'ITIL实践指南', level: '进阶', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'asset-management',
    skillName: '资产管理',
    aliases: ['asset-management', '资产管理', 'IT资产', '资产台账', 'CMDB', '资产生命周期', '库存管理'],
    category: 'IT运维',
    description: 'IT资产台账和生命周期管理',
    difficulty: '入门',
    estimatedTime: '1-2周',
    prerequisites: [],
    relatedSkills: ['it-service-management', 'helpdesk'],
    learningPath: [
      {
        phase: '资产管理基础',
        goal: '掌握资产分类、台账建立与生命周期管理',
        resources: [
          { type: 'article', title: 'IT资产管理方法', url: 'https://www.runoob.com/w3cnote/server-hardware.html', description: 'IT资产管理方法与实践', level: '入门', free: true },
          { type: 'doc', title: 'ServiceNow资产管理', url: 'https://docs.servicenow.com/bundle/utah-it-service-management/page/product/it-asset-management/concept/c_ITAssetManagement.html', description: 'ServiceNow资产管理模块', level: '入门', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'helpdesk',
    skillName: '技术支持',
    aliases: ['helpdesk', '技术支持', '服务台', 'IT支持', 'Help Desk', '工单处理', '客户服务'],
    category: 'IT运维',
    description: '用户问题处理和服务台',
    difficulty: '入门',
    estimatedTime: '1-2周',
    prerequisites: [],
    relatedSkills: ['it-service-management', 'communication', 'windows-server'],
    learningPath: [
      {
        phase: '服务台基础',
        goal: '掌握工单处理、问题分级与用户沟通',
        resources: [
          { type: 'doc', title: 'ITIL服务台指南', url: 'https://www.axelos.com/best-practice-solutions/itil', description: 'ITIL服务台官方指南', level: '入门', free: true },
        ],
      },
      {
        phase: '进阶支持',
        goal: '掌握远程支持、知识库建设与SLA管理',
        resources: [
          { type: 'doc', title: 'Zendesk文档', url: 'https://support.zendesk.com/hc/en-us', description: 'Zendesk服务台平台文档', level: '进阶', free: true },
        ],
      },
    ],
  },
  {
    skillId: 'stakeholder-management',
    skillName: '干系人管理',
    aliases: ['stakeholder-management', '干系人管理', '相关方管理', '利益相关者', '沟通管理', 'Stakeholder', '项目关系'],
    category: '项目管理',
    description: '项目相关方沟通协调',
    difficulty: '简单',
    estimatedTime: '1-2个月',
    prerequisites: ['project-management'],
    relatedSkills: ['project-management', 'communication', 'requirement-analysis'],
    learningPath: [
      {
        phase: '识别与分析',
        goal: '掌握干系人识别、权力利益矩阵与 Engagement 策略',
        resources: [
          { type: 'doc', title: 'PMI学习资源', url: 'https://www.pmi.org/learning/library', description: 'PMI项目管理学习资源', level: '入门', free: true },
          { type: 'doc', title: 'PMBOK指南', url: 'https://www.pmi.org/pmbok-guide-standards', description: 'PMBOK项目管理标准', level: '入门', free: true },
        ],
      },
      {
        phase: '沟通与协作',
        goal: '掌握冲突解决、谈判技巧与期望管理',
        resources: [
          { type: 'book', title: '项目干系人管理', url: 'https://book.douban.com/subject/30177975/', description: '干系人管理实战指南', level: '进阶', free: false },
        ],
      },
    ],
  },
  {
    skillId: 'quality-management',
    skillName: '质量管理',
    aliases: ['quality-management', '质量管理', 'QA', '质量保证', '质量控制', '测试管理', '质量审计', '六西格玛'],
    category: '项目管理',
    description: '项目质量保证与控制',
    difficulty: '简单',
    estimatedTime: '1-2个月',
    prerequisites: ['project-management'],
    relatedSkills: ['project-management', 'risk-management', 'tech-writing'],
    learningPath: [
      {
        phase: '质量基础',
        goal: '掌握质量规划、质量保证与质量控制流程',
        resources: [
          { type: 'doc', title: 'PMI学习资源', url: 'https://www.pmi.org/learning/library', description: 'PMI质量管理学习资源', level: '入门', free: true },
          { type: 'doc', title: 'PMBOK质量指南', url: 'https://www.pmi.org/pmbok-guide-standards', description: 'PMBOK项目质量管理标准', level: '入门', free: true },
        ],
      },
      {
        phase: '质量工具',
        goal: '掌握PDCA、鱼骨图、控制图与审计方法',
        resources: [
          { type: 'book', title: '项目管理质量管理', url: 'https://book.douban.com/subject/30177975/', description: '质量管理实践指南', level: '进阶', free: false },
          { type: 'doc', title: '六西格玛基础', url: 'https://www.sixsigma-institute.org/', description: '六西格玛质量管理', level: '进阶', free: true },
        ],
      },
    ],
  },
];