/* =========================================================================
   共通テスト対策キット — コンテンツデータ（長文3本 / 全10問 / 小問22 / 100点）
   このファイルは exam.html 専用です。通常版・Pro版の学習データとは完全に独立。
   構造:
     passages[] = { id, tag, kind, title, titleJa, mins, words, paras[{en,ja}],
                    table:{caption,head,rows,note}, tableAfter, qs[] }
     qs[]       = { no, field, stem, stemJa, items[] }
     items[]    = { id, q, c[4], a(正解index), pt(配点), exp(解説), gram(文法), vocab[[語,発音,意味]] }
   配点合計: 24 + 36 + 40 = 100
   ========================================================================= */
window.EXAM_KIT = {
  meta: {
    name: '共通テスト対策キット',
    sub: 'Reading 実戦セット vol.1',
    ver: '1.0.0',
    price: 560,
    total: 100,
    passages: 3,
    qs: 10,
    items: 22,
    mins: 24
  },
  /* 設問の分野タグ（結果画面の分野別分析に使用） */
  fields: {
    info:  { n: '情報検索',      d: '本文・図表から該当箇所を探す力' },
    word:  { n: '語彙・言い換え', d: '文脈から語義を推定する力' },
    infer: { n: '推論・目的',    d: '書かれていないことを根拠から導く力' },
    flow:  { n: '展開・心情',    d: '出来事の順序と筆者の変化をつかむ力' },
    data:  { n: '図表・データ',  d: '数値と本文を結びつける力' },
    sum:   { n: '要約・見出し',  d: '段落の中心をつかみ言い換える力' }
  },

  passages: [
    /* ================= 長文 1：案内文（第2問A型） ================= */
    {
      id: 'e1',
      tag: '第2問 A 型',
      kind: '案内・掲示',
      title: 'Greenfield Community Center — Autumn Workshop Series',
      titleJa: 'グリーンフィールド公民館 秋のワークショップ案内',
      mins: 7,
      words: 250,
      tableAfter: 1,
      paras: [
        { en: "The Greenfield Community Center is pleased to announce four hands-on workshops for this autumn. All sessions are held in the Center's second-floor studio and are open to residents aged 15 and over. No previous experience is required, and all tools are provided.",
          ja: 'グリーンフィールド公民館では、この秋、実践型のワークショップを4つ開催いたします。会場はいずれも当館2階スタジオで、15歳以上の地域住民が参加できます。経験は不要で、道具はすべて用意しています。' },
        { en: "The schedule and fees are shown below. Please check the notes carefully before you apply, because the conditions are not the same for every workshop.",
          ja: '日程と料金は下の表のとおりです。条件はワークショップごとに異なりますので、申し込む前に注意書きをよくご確認ください。' },
        { en: "How to apply: complete the online form on our website by Friday, October 3. Places are limited to 16 per workshop and are offered on a first-come, first-served basis. If a workshop is already full, your name will be added to a waiting list and we will contact you by email. Fees are collected in cash on the day.",
          ja: '申し込み方法：10月3日（金）までに当館ウェブサイトの申込フォームにご記入ください。定員は各回16名で、受付は先着順です。定員に達している場合はキャンセル待ちに登録し、メールでご連絡します。参加費は当日現金でいただきます。' },
        { en: "Cancellations made at least three days in advance receive a full refund. For the Repair Cafe, please bring one item of clothing you would like to mend; the usual materials charge is waived this year thanks to a donation from a local shop.",
          ja: '3日前までのキャンセルは全額返金します。リペアカフェには、直したい衣類を1点お持ちください。通常いただく材料費は、地元商店からの寄付により本年度は免除します。' },
        { en: "Volunteers welcome: if you can help with setting up chairs or guiding visitors, please tick the box on the application form. Volunteers take part in the workshop of their choice at no cost.",
          ja: 'ボランティア募集：椅子の設置や来館者の案内をお手伝いいただける方は、申込フォームのチェック欄にご記入ください。ボランティアの方は希望するワークショップに無料で参加できます。' }
      ],
      table: {
        caption: 'Autumn Workshops 2026',
        head: ['Workshop', 'Date', 'Fee', 'Note'],
        rows: [
          ['Bread Baking Basics', 'Sat, Oct 11', '¥1,500', 'Bring a container for your bread'],
          ['Repair Cafe: Fix Your Own Clothes', 'Sun, Oct 19', 'Free', 'Bring one item to mend'],
          ['Digital Photo Editing', 'Sat, Nov 1', '¥1,200', 'Laptops available to borrow'],
          ['Winter Garden Planning', 'Sun, Nov 16', '¥800 (¥400 for members)', 'Held outdoors if it is fine']
        ],
        note: 'Center members: ¥400 discount is applied to the last workshop only.'
      },
      qs: [
        {
          no: '問1', field: 'info',
          stem: 'Answer the following questions about the workshops.',
          stemJa: 'ワークショップに関する次の問いに答えなさい。',
          items: [
            { id: 'q1', pt: 4,
              q: 'Which workshop can Center members attend at a reduced fee?',
              c: ['Bread Baking Basics', 'Repair Cafe: Fix Your Own Clothes', 'Digital Photo Editing', 'Winter Garden Planning'],
              a: 3,
              exp: '表の Fee 欄に「¥800 (¥400 for members)」と書かれているのは Winter Garden Planning のみ。表の下の注記にも「the last workshop only（最後のワークショップのみ）」と限定が明示されています。Repair Cafe は会員割引ではなく、そもそも Free なので選べません。表つきの問題は「割引・無料・条件」の3語に印をつけて読むと処理が速くなります。',
              gram: '(¥400 for members) の for は「〜にとって・〜向けの」対象を示す前置詞。fee / price と結びつくと「〜の場合の料金」を表します。discount is applied to A は受動態で「割引がAに適用される」。',
              vocab: [['fee', '/fiː/', '料金・受講料'], ['reduced', '/rɪˈdjuːst/', '割り引かれた・下げられた'], ['apply to', '/əˈplaɪ tuː/', '〜に適用される']] },
            { id: 'q2', pt: 4,
              q: 'What must a person do by October 3 in order to join a workshop?',
              c: ['Pay the fee in cash', 'Complete the online application form', 'Bring an item of clothing to mend', 'Ask to be put on the waiting list'],
              a: 1,
              exp: '第3段落「complete the online form on our website by Friday, October 3」が根拠。by は期限を示すので「10月3日までに済ませること」＝フォーム記入です。Pay the fee は同じ段落の最後に「collected in cash on the day（当日集金）」とあるので期限が違います。設問の by を見たら本文の by / until / no later than を探す、が定石です。',
              gram: 'by + 時点 =「〜までに（完了）」。継続を表す until と混同しないこと。complete a form は「用紙に記入する」で、fill in / fill out と同義の書き言葉。',
              vocab: [['complete a form', '', '申込用紙に記入する'], ['in advance', '/ɪn ədˈvɑːns/', '前もって・事前に'], ['collect', '/kəˈlekt/', '（料金を）徴収する']] }
          ]
        },
        {
          no: '問2', field: 'word',
          stem: 'Choose the best meaning for each expression in the notice.',
          stemJa: '案内文中の表現の意味として最も適切なものを選びなさい。',
          items: [
            { id: 'q3', pt: 4,
              q: 'The phrase "on a first-come, first-served basis" means that places are given',
              c: ['to residents over 15 only', 'to those who apply earliest', 'to Center members first', 'by drawing lots'],
              a: 1,
              exp: '直前に「Places are limited to 16 per workshop」と定員が示され、直後にキャンセル待ちの説明が続きます。この文脈で「来た順に応じる」＝先着順。by drawing lots（抽選）は本文にない手続きで、抽選なら waiting list の説明が不要になる点からも消せます。「限定 → 配分方法 → あふれた人の扱い」という案内文の型を覚えておくと即答できます。',
              gram: 'on a ... basis は「〜という方式で」を表す定型表現（on a daily basis など）。first-come, first-served はハイフンで結ばれた複合形容詞で、名詞 basis を修飾しています。',
              vocab: [['basis', '/ˈbeɪsɪs/', '基準・方式'], ['draw lots', '', 'くじを引く・抽選する'], ['waiting list', '', 'キャンセル待ちの名簿']] },
            { id: 'q4', pt: 4,
              q: 'In the fourth paragraph, "waived" is closest in meaning to',
              c: ['doubled', 'not charged', 'paid later', 'returned to applicants'],
              a: 1,
              exp: 'waive a charge は「請求を免除する」。直後の thanks to a donation from a local shop（寄付のおかげで）が理由を示し、「払わなくてよい」方向だと判断できます。paid later なら「支払いは残る」ので不可、returned（返金）は一度払う前提なので不可。理由を表す thanks to / because of は語義推測の最良のヒントです。',
              gram: 'the usual materials charge is waived は受動態で、動作主（the Center）は自明なので省略。this year が「今年だけ」という限定を加えています。',
              vocab: [['waive', '/weɪv/', '（権利・料金を）免除する'], ['donation', '/dəʊˈneɪʃn/', '寄付'], ['charge', '/tʃɑːdʒ/', '料金・請求']] }
          ]
        },
        {
          no: '問3', field: 'infer',
          stem: 'Answer the questions about the purpose of the notice.',
          stemJa: '案内文の目的について答えなさい。',
          items: [
            { id: 'q5', pt: 4,
              q: 'What is the main purpose of this notice?',
              c: ['To report the results of last summer’s workshops', 'To invite local people to join the workshops and explain how to apply', 'To ask residents to donate tools to the Center', 'To announce that the studio has moved to a new building'],
              a: 1,
              exp: '第1段落の announce four hands-on workshops（開催の告知）と第3段落の How to apply（申込方法）が二本柱。目的を問う問題は「最初の段落」と「行動を促す段落」を合わせて判断します。道具は all tools are provided と書かれているので寄付の依頼ではなく、会場も second-floor studio と現状の説明にすぎません。',
              gram: 'be pleased to do は「喜んで〜する」。告知文の丁寧な決まり文句です。open to A は「Aに開かれている＝Aが参加できる」。',
              vocab: [['announce', '/əˈnaʊns/', '告知する・発表する'], ['hands-on', '/ˌhændz ˈɒn/', '実践型の・体験型の'], ['venue', '/ˈvenjuː/', '会場']] },
            { id: 'q6', pt: 4,
              q: 'A person who volunteers for the series will',
              c: ['receive a small cash payment', 'be able to take part in one workshop without paying', 'be allowed to join all four workshops', 'get priority on the waiting list'],
              a: 1,
              exp: '最終段落「Volunteers take part in the workshop of their choice at no cost.」が根拠。of their choice は「自分が選んだ（1つの）」なので all four は言い過ぎ。金銭の支払いや待機列の優先は本文にありません。選択肢の all / every / only は本文の限定表現とぶつかることが多く、真偽判定の狙い目です。',
              gram: 'at no cost は前置詞句で副詞のように働き for free と同義。the workshop of their choice は「their choice（彼らの選択）」を of で後置修飾した形。',
              vocab: [['volunteer', '/ˌvɒlənˈtɪə/', 'ボランティア／志願する'], ['at no cost', '', '無料で'], ['priority', '/praɪˈɒrəti/', '優先（権）']] }
          ]
        }
      ]
    },

    /* ================= 長文 2：ブログ＋返信メール（第3・4問型） ================= */
    {
      id: 'e2',
      tag: '第4問 型',
      kind: 'ブログ＋メール',
      title: 'Two Weeks Without My Smartphone',
      titleJa: 'スマホのない2週間',
      mins: 8,
      words: 330,
      paras: [
        { en: "Last month my phone slipped out of my pocket on the train, and by the time I noticed, it was gone. Replacing it would take two weeks, so I had no choice but to live without it. I expected the worst.",
          ja: '先月、電車でポケットからスマホが滑り落ち、気づいたときにはもうなかった。買い替えには2週間かかるというので、それなしで暮らすほかなかった。最悪の事態を予想していた。' },
        { en: "The first three days were genuinely hard. I missed my alarm twice, I got lost on the way to a friend's house, and I kept reaching for a pocket that was empty. What surprised me most was how often my hand moved before my brain did.",
          ja: '最初の3日間は本当につらかった。アラームに2回気づかず、友人の家へ行く途中で道に迷い、空のポケットに何度も手を伸ばしていた。いちばん驚いたのは、頭より先に手が動く回数の多さだった。' },
        { en: "By the end of the first week, something had changed. I began writing down what I needed to remember, and I found that I remembered it better. On the train I looked out of the window instead of at a screen, and I finally finished the novel that had been in my bag since April.",
          ja: '1週目の終わりには、何かが変わっていた。覚えておくべきことを書き留めるようになり、その方がよく覚えられると気づいた。電車では画面ではなく窓の外を見て、4月からかばんに入れっぱなしだった小説をついに読み終えた。' },
        { en: "I am not going to pretend that life without a phone is easy. Arranging to meet people took three times as long, and I could not check the timetable when a train was delayed. Still, when my new phone arrived, I decided to keep two habits: I leave it in another room while I study, and I do not touch it for the first hour after I wake up.",
          ja: 'スマホのない生活が楽だなどと言うつもりはない。人と会う約束を取りつけるのに3倍の時間がかかり、電車が遅れても時刻表を確認できなかった。それでも新しいスマホが届いたとき、2つの習慣を続けることにした。勉強中は別の部屋に置くこと、そして起きてから1時間は触らないことだ。' },
        { en: "[Reply] Hi Mei, I read your post twice. The part about your hand moving before your brain really hit home. Our class did a similar experiment last year, though only for 48 hours, and the results were much like yours: sleep improved, and almost everyone underestimated how much they used their phone for nothing in particular.",
          ja: '【返信】メイさん、投稿を2回読みました。頭より先に手が動くという箇所は本当に胸に刺さりました。私たちのクラスも昨年、似たような実験をしました。48時間だけでしたが、結果はあなたとよく似ていました。睡眠は改善し、ほぼ全員が「特に用もなく」スマホを使っている量を実際より少なく見積もっていたのです。' },
        { en: "If you want to go further, try what our teacher calls a \"phone diary\": for one week, write down the reason each time you pick it up. Most people find that half of the entries say \"no reason\". And please do share your two habits at the school assembly next month — a short talk from a student is far more convincing than another lecture from an adult. — Daniel",
          ja: 'さらに進めたいなら、先生が「スマホ日記」と呼ぶものを試してみてください。1週間、手に取るたびにその理由を書くのです。多くの人が、記録の半分が「理由なし」になると気づきます。それと、来月の全校集会でぜひあの2つの習慣を話してください。生徒による短い話のほうが、大人のもう一つの講話よりずっと説得力があります。—ダニエル' }
      ],
      qs: [
        {
          no: '問4', field: 'flow',
          stem: 'Answer the questions about the order of events and the facts.',
          stemJa: '出来事の順序と事実について答えなさい。',
          items: [
            { id: 'q7', pt: 4,
              q: 'Which of the following happened first in Mei\'s story?',
              c: ['She missed her alarm.', 'She lost her phone on the train.', 'She finished reading a novel.', 'Her new phone arrived.'],
              a: 1,
              exp: '第1段落で紛失、第2段落「The first three days」でアラーム、第3段落「By the end of the first week」で読了、第4段落で新端末の到着。時間表現（Last month → The first three days → By the end of the first week → when my new phone arrived）を拾えば順序は一目で決まります。順序問題は選択肢を先に読み、本文の時間標識に番号を書き込むのが最短です。',
              gram: 'by the time S V は「SがVするときまでには」。主節が過去完了・過去になりやすい構文（by the time I noticed, it was gone）。',
              vocab: [['slip out of', '', '〜から滑り落ちる'], ['replace', '/rɪˈpleɪs/', '買い替える・取り替える'], ['have no choice but to do', '', '〜するしかない']] },
            { id: 'q8', pt: 4,
              q: 'What did Mei still find difficult after the first week?',
              c: ['Waking up on time', 'Making arrangements to meet people', 'Remembering what she had to do', 'Reading on the train'],
              a: 1,
              exp: '第4段落「Arranging to meet people took three times as long」が根拠。アラーム（起床）は第2段落で最初の3日間の話、記憶と読書は第3段落で改善した側に入っています。「still（それでも／依然として）」を含む設問は、良くなったことと変わらなかったことを本文で仕分ける問題だと考えてください。',
              gram: 'three times as long (as usual) は倍数表現「〜の3倍長く」。as ... as の間に形容詞・副詞の原級を置きます。',
              vocab: [['arrange to do', '', '〜する手はずを整える'], ['delay', '/dɪˈleɪ/', '遅らせる／遅延'], ['timetable', '/ˈtaɪmteɪbl/', '時刻表']] }
          ]
        },
        {
          no: '問5', field: 'flow',
          stem: 'Answer the questions about the writer\'s feelings.',
          stemJa: '筆者の心情について答えなさい。',
          items: [
            { id: 'q9', pt: 5,
              q: 'How did Mei\'s attitude change during the two weeks?',
              c: ['From excitement to disappointment', 'From expecting the worst to finding unexpected benefits', 'From anger at herself to indifference', 'From confidence to serious worry'],
              a: 1,
              exp: '第1段落末の I expected the worst と、第3段落の something had changed 以降の肯定的な発見が対になっています。第4段落で「楽だとは言わない」と留保しつつ、2つの習慣を残す決断で締めるので、全体は「悲観 → 予想外の利点」。心情変化の問題は最初と最後の1文だけを比べるのが原則です。',
              gram: 'expect the worst は「最悪を予想する」。had changed は過去完了で「1週目の終わりという過去の時点までに完了していた変化」を表します。',
              vocab: [['genuinely', '/ˈdʒenjuɪnli/', '本当に・心から'], ['benefit', '/ˈbenɪfɪt/', '利点・恩恵'], ['indifference', '/ɪnˈdɪfrəns/', '無関心']] },
            { id: 'q10', pt: 5,
              q: 'Why does Mei mention the novel in her bag?',
              c: ['To explain why her bag was so heavy', 'To give an example of a change she was able to make', 'To recommend the novel to her readers', 'To complain about her school reading list'],
              a: 1,
              exp: 'since April（4月から放置）という情報とセットで、「画面を見ない時間が読書に変わった」ことの具体例になっています。作品名も評価語もないので推薦ではなく、学校への不満も述べられていません。「なぜ筆者はこれを挙げるのか」型は、直前の主張文を探して「その具体例」と答えるのが定石です。',
              gram: 'the novel that had been in my bag since April は関係代名詞 that＋過去完了で「（読み終えた時点まで）ずっと入っていた」継続を表します。',
              vocab: [['instead of', '', '〜の代わりに'], ['recommend', '/ˌrekəˈmend/', '推薦する'], ['complain about', '', '〜について不満を言う']] }
          ]
        },
        {
          no: '問6', field: 'info',
          stem: 'Answer the questions about Daniel\'s reply.',
          stemJa: 'ダニエルの返信について答えなさい。',
          items: [
            { id: 'q11', pt: 4,
              q: 'What does Daniel suggest that Mei should do for one week?',
              c: ['Leave her phone in another room', 'Write down her reason every time she picks up her phone', 'Repeat the experiment for another 48 hours', 'Ask her teacher to give a lecture'],
              a: 1,
              exp: '返信の第2段落「for one week, write down the reason each time you pick it up」が根拠。Leave her phone in another room はメイ自身が既に決めた習慣（第4段落）で、ダニエルの提案ではありません。「誰の発言か」を取り違えさせる選択肢は複数話者の問題で必ず出ます。話者ごとに記号をつけて読みましょう。',
              gram: 'suggest (that) S (should) do の形。each time S V は接続詞的に「〜するたびに」。',
              vocab: [['pick up', '', '手に取る・拾い上げる'], ['entry', '/ˈentri/', '（記録の）1件・記入事項'], ['assembly', '/əˈsembli/', '集会']] },
            { id: 'q12', pt: 4,
              q: 'The expression "hit home" in the reply is closest in meaning to',
              c: ['made him angry', 'felt very true to him', 'was hard to understand', 'reminded him of his house'],
              a: 1,
              exp: '直後に「私たちのクラスでも同じ結果だった」と共感が続くので、「強く実感された＝胸に刺さった」の意味。home に「家」の意味を残すと4番目のひっかけに落ちます。イディオムは直後の1文が言い換えになっていることが多いので、そこを根拠にしてください。',
              gram: 'hit home は自動詞的に使うイディオムで「（言葉が）痛切に響く」。The part about ... が主語の長い名詞句であることに注意。',
              vocab: [['hit home', '', '痛切に感じられる'], ['underestimate', '/ˌʌndərˈestɪmeɪt/', '少なく見積もる'], ['for nothing in particular', '', '特に用もなく']] }
          ]
        },
        {
          no: '問7', field: 'infer',
          stem: 'Answer the questions using both texts.',
          stemJa: '2つの文章の両方を用いて答えなさい。',
          items: [
            { id: 'q13', pt: 5,
              q: 'Which statement is true about both Mei and Daniel\'s classmates?',
              c: ['They both lost their phones by accident.', 'They both kept a phone diary for a week.', 'They both used their phones more than they had realized.', 'They both spoke at a school assembly.'],
              a: 2,
              exp: 'メイは「頭より先に手が動く」、クラスは「使用量を少なく見積もっていた」。どちらも無自覚な使用の多さを示すので共通点はこれ。紛失は偶然だがクラスは実験、日記はこれからの提案、集会での発表も未実施。共通点問題は「両方に書かれている抽象度の高い1点」を選ぶのが鉄則です。',
              gram: 'more than they had realized は比較級＋過去完了で「（当時）気づいていたよりも多く」。underestimate との言い換え関係を押さえましょう。',
              vocab: [['by accident', '', '偶然に'], ['realize', '/ˈrɪəlaɪz/', '気づく・自覚する'], ['similar', '/ˈsɪmələ/', '似ている']] },
            { id: 'q14', pt: 5,
              q: 'Why does Daniel encourage Mei to speak at the assembly?',
              c: ['Because their teacher has already asked her to do so', 'Because she needs more practice in English', 'Because a student\'s own account is more persuasive than an adult\'s lecture', 'Because the assembly has no other speakers'],
              a: 2,
              exp: '最終文「a short talk from a student is far more convincing than another lecture from an adult」が根拠。convincing＝persuasive の言い換えを見抜けば即決です。先生の依頼や英語練習は本文になし。理由を問う問題は、because / so / 比較級の文を先に探すと当たります。',
              gram: 'far more convincing than ~ は比較級の強調（far / much / a lot）。another lecture の another は「（またしても）もう一つの」というニュアンス。',
              vocab: [['convincing', '/kənˈvɪnsɪŋ/', '説得力のある'], ['persuasive', '/pəˈsweɪsɪv/', '説得力のある'], ['account', '/əˈkaʊnt/', '（体験の）話・説明']] }
          ]
        }
      ]
    },

    /* ================= 長文 3：説明文＋データ（第5・6問型） ================= */
    {
      id: 'e3',
      tag: '第6問 型',
      kind: '説明文＋図表',
      title: 'Why Cities Get Hotter — and What Actually Cools Them',
      titleJa: '都市はなぜ暑くなるのか、そして何が本当に効くのか',
      mins: 9,
      words: 360,
      tableAfter: 2,
      paras: [
        { en: "On a summer night, the centre of a large city can be several degrees warmer than the fields around it. Scientists call this the urban heat island. The cause is not only the heat produced by cars and air conditioners; it is mainly the materials that cities are built from. Asphalt and concrete absorb sunlight during the day and release it slowly after dark.",
          ja: '夏の夜、大都市の中心部は周囲の農地より数度高くなることがある。科学者はこれをヒートアイランドと呼ぶ。原因は自動車やエアコンが出す熱だけではない。主たる原因は、都市を造っている材料そのものである。アスファルトとコンクリートは日中に日光を吸収し、日が落ちてからゆっくりと放出する。' },
        { en: "Because the effect builds up over hours, the difference between city and countryside is usually largest late in the evening, not at noon. Narrow streets between tall buildings trap the heat, and dry surfaces give cities little of the cooling that occurs when water evaporates from soil and leaves.",
          ja: 'この効果は何時間もかけて積み上がるため、都市と郊外の差がもっとも大きくなるのは正午ではなく夜遅くである。高い建物に挟まれた狭い通りは熱を閉じ込め、乾いた路面のため、土や葉から水が蒸発するときに生じる冷却がほとんど得られない。' },
        { en: "Four measures are often discussed. Street trees provide shade exactly where people walk. Cool roofs, painted in light colours, send sunlight back into the sky. Small parks act as cool islands whose effect spreads into nearby streets. Water features look attractive, but they cool only a very small area.",
          ja: 'よく議論される対策は4つある。街路樹は人が歩くまさにその場所に日陰をつくる。明るい色に塗った「クールルーフ」は日光を空へ跳ね返す。小さな公園は冷たい島として働き、その効果は周囲の通りにも広がる。噴水などの水景は見た目は良いが、冷やせる範囲はごく狭い。' },
        { en: "No single measure is enough. Cool roofs are the cheapest way to begin and they work from the first summer, but they do little for people at street level. Trees do the most for pedestrians, yet a young tree takes about a decade to grow a crown large enough to matter. A sensible plan therefore starts with roofs, plants trees at the same time, and treats water features as decoration rather than as a cooling strategy.",
          ja: '単独で十分な対策はない。クールルーフは着手費用が最も安く、最初の夏から効果が出るが、路上の人にはほとんど効かない。街路樹は歩行者にとって最も効果が大きいが、若木が意味のある大きさの樹冠を広げるには10年ほどかかる。したがって賢明な計画は、屋根から始め、同時に樹を植え、水景は冷却策ではなく装飾として扱う。' },
        { en: "Cities that have combined these measures report fewer heat-related hospital visits, and residents describe the streets as more comfortable. The lesson is simple: cooling a city depends less on one clever invention than on many ordinary surfaces being changed at the same time.",
          ja: 'これらの対策を組み合わせた都市では、暑さに関連した受診が減ったと報告され、住民は通りがより快適になったと述べている。教訓は単純だ。都市を冷やすことは、一つの巧妙な発明よりも、ありふれた多数の面を同時に変えることにかかっている。' }
      ],
      table: {
        caption: 'Table 1: Comparison of four cooling measures',
        head: ['Measure', 'Average cooling on a hot day', 'Cost per area', 'Years to full effect'],
        rows: [
          ['Street trees', '1.8 °C', 'Medium', '8–12'],
          ['Cool roofs', '1.2 °C', 'Low', '0 (immediate)'],
          ['Small parks', '1.5 °C', 'High', '3–5'],
          ['Water features', '0.4 °C', 'Medium', '0 (immediate)']
        ],
        note: 'Figures are averages from 12 cities; cooling was measured 1.5 m above the ground.'
      },
      qs: [
        {
          no: '問8', field: 'sum',
          stem: 'Choose the best heading for each paragraph.',
          stemJa: '各段落の見出しとして最も適切なものを選びなさい。',
          items: [
            { id: 'q15', pt: 4,
              q: 'The best heading for Paragraph 1 is:',
              c: ['A short history of city planning', 'What makes cities warmer than the countryside', 'How air conditioners changed our homes', 'Why summer nights are becoming shorter'],
              a: 1,
              exp: '第1段落は「差の存在 → 名称 → 原因は主に建材」という流れで、原因の提示が中心。エアコンは not only ... で退けられた要素なので中心にはなりません。見出し選択は「その段落だけを読んで要約 → 選択肢と照合」の順で行い、段落内の一語だけに反応しないことが重要です。',
              gram: 'not only A; it is mainly B は「Aだけではなく主にB」と焦点をBに移す構文。セミコロンは前後を対比的につなぎます。',
              vocab: [['absorb', '/əbˈsɔːb/', '吸収する'], ['release', '/rɪˈliːs/', '放出する'], ['urban', '/ˈɜːbən/', '都市の']] },
            { id: 'q16', pt: 4,
              q: 'The best heading for Paragraph 2 is:',
              c: ['Why the gap is widest late in the evening', 'How scientists measure air temperature', 'The best time of day to go jogging', 'Why the countryside is becoming drier'],
              a: 0,
              exp: '第2段落の主張は「積み上がるので差は夜遅くに最大」。そのあとの狭い通りと乾いた路面は、その理由の補足です。測定方法や田舎の乾燥化は述べられていません。段落の最初の文（トピックセンテンス）が見出しになる典型例です。',
              gram: 'Because S V, S V の従属節が文頭に来る形。largest late in the evening, not at noon の not A は直前の内容を否定して対比を作ります。',
              vocab: [['build up', '', '積み上がる・蓄積する'], ['trap', '/træp/', '閉じ込める'], ['evaporate', '/ɪˈvæpəreɪt/', '蒸発する']] },
            { id: 'q17', pt: 4,
              q: 'The best heading for Paragraph 4 is:',
              c: ['Choosing the right order of measures', 'Why trees should never be planted', 'The cheapest way to build a park', 'How to design a beautiful fountain'],
              a: 0,
              exp: '第4段落は「単独では不十分 → 屋根から始め、同時に植樹 → 水景は装飾」という順序の提案。starts with / at the same time / rather than という語が順序と優先度を示しています。「trees should never be planted」は本文と正反対で、極端な never を含む選択肢は多くの場合誤りです。',
              gram: 'A rather than B は「BよりむしろA」。treats water features as decoration は treat A as B「AをBとみなす」の型。',
              vocab: [['pedestrian', '/pəˈdestriən/', '歩行者'], ['sensible', '/ˈsensəbl/', '賢明な・分別のある'], ['decoration', '/ˌdekəˈreɪʃn/', '装飾']] }
          ]
        },
        {
          no: '問9', field: 'data',
          stem: 'Answer the questions using Table 1 and the passage.',
          stemJa: '表1と本文を用いて答えなさい。',
          items: [
            { id: 'q18', pt: 5,
              q: 'According to Table 1, which measure produces the largest average cooling?',
              c: ['Small parks', 'Cool roofs', 'Street trees', 'Water features'],
              a: 2,
              exp: '表の2列目で 1.8 °C が最大値で、行は Street trees。表の問題では「どの列を比べるのか」を最初に確定させることが最重要で、ここでは Cost や Years に目を移すと誤ります。1.5（Small parks）との差が小さいので、数値の読み違いにも注意してください。',
              gram: 'According to A は「Aによれば」。produce は「（結果を）生み出す」で、cause より中立的な語です。',
              vocab: [['average', '/ˈævərɪdʒ/', '平均の・平均'], ['measure', '/ˈmeʒə/', '対策・方策'], ['per', '/pə/', '〜あたり']] },
            { id: 'q19', pt: 5,
              q: 'Which measure works from the first summer but does little for people walking in the street?',
              c: ['Small parks', 'Cool roofs', 'Street trees', 'Water features'],
              a: 1,
              exp: '表で Years to full effect が 0 (immediate) なのは Cool roofs と Water features の2つ。ここで本文第4段落の「they work from the first summer, but they do little for people at street level」が決定打となり Cool roofs に絞れます。表だけ・本文だけでは絞りきれない設計になっており、共通テストで最も差がつく形です。',
              gram: 'do little for A は「Aにはほとんど役に立たない」。little は否定的な意味の数量詞で、a little（少しはある）とは意味が反転します。',
              vocab: [['immediate', '/ɪˈmiːdiət/', '即時の'], ['at street level', '', '路上の高さで'], ['crown', '/kraʊn/', '樹冠（木の枝葉の広がり）']] },
            { id: 'q20', pt: 4,
              q: 'How does the writer regard water features?',
              c: ['As the most effective way to cool a city', 'As decoration rather than a cooling strategy', 'As the cheapest measure available', 'As dangerous for young children'],
              a: 1,
              exp: '第3段落「look attractive, but they cool only a very small area」と第4段落「treats water features as decoration rather than as a cooling strategy」が二重の根拠。表でも 0.4 °C と最小です。筆者の評価を問う問題は、but / however の後ろに答えがあることが多いと覚えておきましょう。',
              gram: 'regard A as B「AをBとみなす」。設問の regard は本文の treat ... as の言い換えで、同義表現の置き換えが正誤の分かれ目になります。',
              vocab: [['regard A as B', '', 'AをBとみなす'], ['attractive', '/əˈtræktɪv/', '魅力的な'], ['strategy', '/ˈstrætədʒi/', '戦略']] }
          ]
        },
        {
          no: '問10', field: 'sum',
          stem: 'Complete the summary with the best option for each blank.',
          stemJa: '要約文の空所に入る最も適切なものを選びなさい。',
          items: [
            { id: 'q21', pt: 7,
              q: 'Summary: Cities stay warm at night mainly because ( 1 ) absorb sunlight and release it slowly.',
              c: ['their residents and vehicles', 'their building materials', 'their small parks', 'their water features'],
              a: 1,
              exp: '第1段落の「it is mainly the materials that cities are built from」を言い換えた空所。not only the heat produced by cars（車の熱だけではない）とあるため vehicles は主原因になりません。要約完成は「本文の主張文を1文選び、それを抽象語に置き換える」作業だと考えると迷いません。',
              gram: '空所は主語なので、動詞 absorb（三人称複数に一致）から複数名詞が入ると判断できます。文法一致は要約問題の強力なヒントです。',
              vocab: [['material', '/məˈtɪəriəl/', '材料・素材'], ['vehicle', '/ˈviːəkl/', '車両'], ['resident', '/ˈrezɪdənt/', '住民']] },
            { id: 'q22', pt: 7,
              q: 'Summary (continued): The writer advises cities to begin with ( 2 ) while planting trees for the future.',
              c: ['small parks', 'water features', 'cool roofs', 'more air conditioners'],
              a: 2,
              exp: '第4段落「A sensible plan therefore starts with roofs, plants trees at the same time」が根拠。while planting trees（樹は同時進行）という条件があるため、「最初に始めるもの」は屋根に限定されます。小公園は費用が High、エアコンは熱を出す側なので不可。',
              gram: 'while (they are) planting trees は分詞構文的な省略。start with A「Aから始める」と begin by doing の言い換えも押さえましょう。',
              vocab: [['sensible', '/ˈsensəbl/', '賢明な'], ['combine', '/kəmˈbaɪn/', '組み合わせる'], ['invention', '/ɪnˈvenʃn/', '発明']] }
          ]
        }
      ]
    }
  ]
};
