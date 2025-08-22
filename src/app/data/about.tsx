import Link from "next/link";
import Image from "next/image";

export const aboutTexts = [
  {
    title: "The idea behind Track & Learn",
    content: (
      <div className="flex flex-col gap-5">
        <p>
          <strong>Track & Learn</strong> is a free-to-use web application designed especially for educators. 
          Its mission is to make the process of monitoring student learning <strong>simpler, more 
          accurate, and less time-consuming</strong>. Teachers can create classes, assign tests, 
          and track performance in an intuitive way, supported by AI tools that assist 
          with test generation.
        </p>
        <p>
          The project was born from a common classroom reality: many students reach 
          final evaluations with significant gaps in understanding, while teachers and 
          families often lack timely signals to anticipate such outcomes. Track & Learn 
          provides educators with a <strong>practical way</strong> to check student progress 
          throughout the course, allowing them to adjust, reinforce, or reorganize 
          their methods when it truly matters.
        </p>
      </div>
    )
  },
  {
    title: "Creating tests and templates",
    content: (
      <div className="flex flex-col gap-5">
        <p>
          One of the core features of Track & Learn is the ability to create tests with 
          <strong>great flexibility</strong>. Teachers can build them manually through a simple form or 
          generate them using <strong>AI</strong>, either from a prompt or a PDF document, always editable afterwards. 
          They can also decide on aspects such as the academic level of the test or whether it should 
          include a time limit.
        </p>
        <p>
          Every time a test is created, what is actually generated is a <b>template</b>. 
          This template will always contain the standard version of the test, which serves as the 
          main reference, and will allow the teacher to add adapted versions when needed. 
          Templates make it easier to manage assessments and ensure consistency 
          between the main test and its adapted counterparts.
        </p>
      </div>
    )
  },
  {
    title: "Working with adaptations",
    content: (
      <div className="flex flex-col gap-5">
        <p>
          Track & Learn supports the creation of <strong>adapted versions</strong> of tests, specifically 
          designed for students with mild learning differences such as slight delays, 
          dyslexia, or similar needs. These adaptations are always linked to the main 
          template: the standard test acts as the base, and teachers can generate 
          additional adapted versions from it. 
        </p>
        <p>
          When assigned, these versions will only be displayed to students previously 
          tagged with the corresponding profile, ensuring <strong>inclusivity</strong> while keeping test 
          management simple and consistent for the teacher.
        </p>
      </div>
    )
  },
  {
    title: "Setting up your classrooms",
    content: (
      <div className="flex flex-col gap-5">
        <p>
          Organizing your students in Track & Learn is simple. Teachers can create classrooms 
          within the platform, and students join easily by entering a code provided for each class. 
          Once inside, the teacher can assign tests directly to the group.
        </p>
        <p>
          For greater flexibility, teachers can also tag individual students with an adaptation 
          profile from within the classroom itself. This way, whenever a test is assigned, 
          those students will automatically receive the <b>adapted version</b> of the test, 
          while the rest of the class receives the standard one.
        </p>
        <p>
          Results are presented both <b>individually</b> and at the <b>classroom level</b>, giving teachers 
          a clear view of performance while keeping the process streamlined.
        </p>
      </div>
    )
  },
  {
    title: "Carousel Learning",
    content: (
      <div className="flex flex-col gap-10">
        <p>
          Track & Learn integrates with{" "}
          <Link href="https://www.carousel-learning.com/" target="_blank" className="text-secondary">
            <strong>Carousel Learning</strong>
          </Link>, a companion app created for educators. Carousel focuses on open-ended 
          questions, question bank creation, and knowledge sharing within a growing 
          educational community.
        </p>
        <Image
          src={'/carousel-logo.ae25f049.svg'}
          alt="Carousel Logo"
          width={400}
          height={200}
          className="self-center"
        />
        <p>
          From each test page in Track & Learn, teachers can <strong>export their questions </strong> 
          directly for Carousel Learning. This connection bridges two complementary 
          tools: <b>Track & Learn</b> for quick, test-based monitoring of student progress 
          and the management of curricular adaptations, supported by AI, and 
          <b> Carousel Learning</b> as a platform for building an educational community through 
          shared question banks, the use of open-ended questions, and a deeper analysis of 
          student results, complemented by additional tools for collaborative teaching.
        </p>
      </div>
    )
  }
];
