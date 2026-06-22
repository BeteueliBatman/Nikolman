insert into public.website_articles (
  slug, image_url, category_key, company_key, published_at, status, title, summary, body
) values (
  'project-archive-launch', '/media/newsroom/completed-projects-archive.jpg', 'projectNews', 'nikolmanProjects', '2026-06-03', 'published',
  '{"en":"Nikolman prepares a dedicated completed projects archive","ka":"Nikolman ამზადებს დასრულებული პროექტების ცალკე არქივს"}'::jsonb,
  '{"en":"The portfolio structure brings project references, photos, scope information, and delivery notes into one clear section.","ka":"პორტფოლიოს სტრუქტურა პროექტების ფოტოებს, მასშტაბს, მდებარეობას და მიწოდების ჩანაწერებს ერთ სუფთა სექციაში აერთიანებს."}'::jsonb,
  '{"en":"The new project archive is designed for completed buildings, production milestones, and detailed case studies. Each entry can carry a hero image, category, location, year, project status, and technical scope, giving visitors a clearer view of Nikolman''s construction capability.","ka":"ახალი პროექტების არქივი შექმნილია დასრულებული შენობებისთვის, წარმოების ეტაპებისა და დეტალური პროექტის მიმოხილვებისთვის. თითოეულ ჩანაწერს ექნება მთავარი სურათი, კატეგორია, მდებარეობა, წელი, სტატუსი და ტექნიკური მასშტაბი, რაც სტუმარს Nikolman-ის შესაძლებლობებს უფრო მკაფიოდ აჩვენებს."}'::jsonb
)
on conflict (slug) do update set
  image_url = excluded.image_url,
  category_key = excluded.category_key,
  company_key = excluded.company_key,
  published_at = excluded.published_at,
  status = excluded.status,
  title = excluded.title,
  summary = excluded.summary,
  body = excluded.body;


insert into public.website_articles (
  slug, image_url, category_key, company_key, published_at, status, title, summary, body
) values (
  'factory-quality-process', '/media/newsroom/factory-quality-process.jpg', 'innovation', 'nikolmanConcrete', '2026-05-22', 'published',
  '{"en":"Factory-controlled production supports predictable project delivery","ka":"ქარხნული კონტროლი პროგნოზირებად მიწოდებას უწყობს ხელს"}'::jsonb,
  '{"en":"Controlled production conditions help improve dimensional accuracy, surface quality, and installation readiness.","ka":"კონტროლირებადი წარმოება აუმჯობესებს ზომების სიზუსტეს, ზედაპირის ხარისხს და მონტაჟისთვის მზადყოფნას."}'::jsonb,
  '{"en":"Nikolman''s prefabricated concrete process is built around repeatable production, engineering-led detailing, and quality checks before delivery. This reduces uncertainty on site and helps project teams plan installation with greater confidence.","ka":"Nikolman-ის ასაწყობი ბეტონის პროცესი ეფუძნება გამეორებად წარმოებას, ინჟინერიაზე დაფუძნებულ დეტალიზაციას და მიწოდებამდე ხარისხის შემოწმებას. ეს ამცირებს გაურკვევლობას ობიექტზე და გუნდებს მონტაჟის უკეთ დაგეგმვაში ეხმარება."}'::jsonb
)
on conflict (slug) do update set
  image_url = excluded.image_url,
  category_key = excluded.category_key,
  company_key = excluded.company_key,
  published_at = excluded.published_at,
  status = excluded.status,
  title = excluded.title,
  summary = excluded.summary,
  body = excluded.body;


insert into public.website_articles (
  slug, image_url, category_key, company_key, published_at, status, title, summary, body
) values (
  'team-growth', '/media/newsroom/nikolman-team-growth.jpg', 'companyNews', 'nikolmanGroup', '2026-04-18', 'published',
  '{"en":"Nikolman expands its construction and production capacity","ka":"Nikolman ზრდის სამშენებლო და საწარმოო შესაძლებლობებს"}'::jsonb,
  '{"en":"The company continues strengthening its team and delivery structure for larger precast and modular programs.","ka":"კომპანია აძლიერებს გუნდსა და მიწოდების სტრუქტურას უფრო დიდი პრეკასტ და მოდულური პროგრამებისთვის."}'::jsonb,
  '{"en":"With a growing employee base and a wider project portfolio, Nikolman is preparing for more complex industrial, residential, commercial, and institutional work. The focus remains on disciplined planning, durable concrete systems, and coordinated execution.","ka":"თანამშრომლების ზრდასთან და პროექტების ფართო პორტფოლიოსთან ერთად Nikolman ემზადება უფრო კომპლექსური ინდუსტრიული, საცხოვრებელი, კომერციული და ინსტიტუციური სამუშაოებისთვის. ფოკუსი რჩება დაგეგმვაზე, გამძლე ბეტონის სისტემებზე და კოორდინირებულ შესრულებაზე."}'::jsonb
)
on conflict (slug) do update set
  image_url = excluded.image_url,
  category_key = excluded.category_key,
  company_key = excluded.company_key,
  published_at = excluded.published_at,
  status = excluded.status,
  title = excluded.title,
  summary = excluded.summary,
  body = excluded.body;


insert into public.website_articles (
  slug, image_url, category_key, company_key, published_at, status, title, summary, body
) values (
  'precast-delivery-milestone', '/media/newsroom/precast-delivery-milestone.jpg', 'pressRelease', 'nikolmanProjects', '2026-03-29', 'published',
  '{"en":"Precast delivery milestone reached on active building program","ka":"აქტიურ სამშენებლო პროგრამაზე პრეკასტ მიწოდების ეტაპი შესრულდა"}'::jsonb,
  '{"en":"A coordinated delivery sequence keeps structural elements moving from production to site with fewer delays.","ka":"კოორდინირებული მიწოდების სქემა სტრუქტურულ ელემენტებს წარმოებიდან ობიექტამდე ნაკლები შეფერხებით ამოძრავებს."}'::jsonb,
  '{"en":"The milestone highlights the value of connecting production planning, transport logistics, and installation sequencing early in the project. This coordinated approach supports cleaner site work and a more reliable construction schedule.","ka":"ეს ეტაპი აჩვენებს, რამდენად მნიშვნელოვანია წარმოების დაგეგმვის, ტრანსპორტირების ლოგისტიკისა და მონტაჟის მიმდევრობის ადრეული დაკავშირება. ასეთი მიდგომა სუფთა სამუშაო პროცესს და უფრო საიმედო სამშენებლო გრაფიკს უწყობს ხელს."}'::jsonb
)
on conflict (slug) do update set
  image_url = excluded.image_url,
  category_key = excluded.category_key,
  company_key = excluded.company_key,
  published_at = excluded.published_at,
  status = excluded.status,
  title = excluded.title,
  summary = excluded.summary,
  body = excluded.body;


insert into public.website_articles (
  slug, image_url, category_key, company_key, published_at, status, title, summary, body
) values (
  'modular-planning-guide', '/media/newsroom/modular-planning-guide.jpg', 'innovation', 'nikolmanConcrete', '2025-12-11', 'published',
  '{"en":"Planning modular concrete systems before the site opens","ka":"მოდულური ბეტონის სისტემების დაგეგმვა ობიექტის გახსნამდე"}'::jsonb,
  '{"en":"Early coordination of geometry, transport, and lifting strategy helps modular programs move with fewer interruptions.","ka":"გეომეტრიის, ტრანსპორტირებისა და აწევის სტრატეგიის ადრეული კოორდინაცია მოდულურ პროგრამებს უფრო მშვიდად ამოძრავებს."}'::jsonb,
  '{"en":"Nikolman''s modular planning process connects engineering decisions with production and site logistics. When the project team aligns openings, connection points, delivery routes, and installation zones early, the construction sequence becomes more controlled and easier to scale.","ka":"Nikolman-ის მოდულური დაგეგმვა ინჟინერიულ გადაწყვეტილებებს წარმოებასა და ობიექტის ლოგისტიკასთან აკავშირებს. როდესაც გუნდი ღიობებს, შეერთების წერტილებს, მიწოდების გზებსა და მონტაჟის ზონებს თავიდანვე ათანხმებს, მშენებლობის მიმდევრობა უფრო კონტროლირებადი და მასშტაბირებადი ხდება."}'::jsonb
)
on conflict (slug) do update set
  image_url = excluded.image_url,
  category_key = excluded.category_key,
  company_key = excluded.company_key,
  published_at = excluded.published_at,
  status = excluded.status,
  title = excluded.title,
  summary = excluded.summary,
  body = excluded.body;


insert into public.website_articles (
  slug, image_url, category_key, company_key, published_at, status, title, summary, body
) values (
  'wall-panel-program', '/media/newsroom/wall-panel-program.jpg', 'projectNews', 'nikolmanProjects', '2025-09-04', 'published',
  '{"en":"Wall panel program prepared for a residential development","ka":"საცხოვრებელი განაშენიანებისთვის კედლის პანელების პროგრამა მომზადდა"}'::jsonb,
  '{"en":"A repeatable wall panel package supports cleaner scheduling for a residential construction program.","ka":"გამეორებადი კედლის პანელების პაკეტი საცხოვრებელ პროექტში უფრო სუფთა გრაფიკს და სწრაფ დახურვას უწყობს ხელს."}'::jsonb,
  '{"en":"The wall panel program is structured around repeatable dimensions, planned openings, and coordinated delivery groups. This helps the site team close building sections faster while preserving the precision expected from factory-made concrete elements.","ka":"კედლის პანელების პროგრამა აგებულია გამეორებად ზომებზე, წინასწარ დაგეგმილ ღიობებსა და კოორდინირებულ მიწოდების ჯგუფებზე. ეს ობიექტის გუნდს ეხმარება შენობის ნაწილების სწრაფად დახურვაში და ქარხნულად დამზადებული ბეტონის სიზუსტის შენარჩუნებაში."}'::jsonb
)
on conflict (slug) do update set
  image_url = excluded.image_url,
  category_key = excluded.category_key,
  company_key = excluded.company_key,
  published_at = excluded.published_at,
  status = excluded.status,
  title = excluded.title,
  summary = excluded.summary,
  body = excluded.body;
