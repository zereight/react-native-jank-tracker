Pod::Spec.new do |s|
  s.name         = "react-native-jank-tracker"
  s.version = "1.0.1-beta.12"
  s.summary      = "Jank tracker for React Native"
  s.description  = "A library to track jank (frame drops) in React Native apps."
  s.homepage     = "https://github.com/zereight/react-native-jank-tracker"
  s.license      = "MIT"
  s.author       = { "zereight" => "definedable@gmail.com" }
  s.platform     = :ios, "12.0"
  s.source       = { :path => "." }
  s.source_files = "ios/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
end 