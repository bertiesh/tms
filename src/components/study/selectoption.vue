<template>
  <div>
    <radio
      v-if="question.type == 1"
      :articletag="articletag"
      :data="data"
      @deleteitem="deleteitem"
    />
    <checkbox
      v-if="question.type == 2"
      :articletag="articletag"
      :data="data"
      @deleteitem="deleteitem"
    />
    <blank
      v-if="question.type == 3 || question.type == 4"
      :articletag="articletag"
      :data="data"
      @deleteitem="deleteitem"
    />
    <selectbox
      v-if="question.type == 5"
      :articletag="articletag"
      :data="data"
      @deleteitem="deleteitem"
    />
    <upload
      v-if="question.type == 8"
      :articletag="articletag"
      :data="data"
      @deleteitem="deleteitem"
    />
    <score
      v-if="question.type == 7"
      :articletag="articletag"
      :data="data"
      @deleteitem="deleteitem"
    />
  </div>
</template>

<script>
import radio from "@/components/study/radio.vue";
import checkbox from "@/components/study/checkbox.vue";
import blank from "@/components/study/blank.vue";
import selectbox from "@/components/study/select.vue";
import upload from "@/components/study/upload.vue";
import score from "@/components/study/score.vue";
import {
  addquestion,
} from "@/api/study/question";
import { addAnswer } from "@/api/study/answer";
export default {
  name: "",
  components: { radio, checkbox, blank, selectbox, upload, score },
  props: {
    /* 配置项 */
    type: {
      type: Number,
      default: () => {
        return null;
      },
    },
    articletag: {
      type: Array,
      default: () => {
        return [];
      },
    },
    question: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      data: {
        questionTitle: "",
        status: this.question.status,
        type: this.question.type,
        tagNameList: ["无"],
        questionDescription: "",
        msg: this.question.msg,
        answer: {
          id: "",
          questionAnalysis: "",
          status: this.question.status,
          type: this.question.type,
          correctAnswers: [""],
          images: "",
        },
      },
    };
  },
  mounted() {
    this.onload();
  },
  methods: {
    deleteitem(value) {
      this.$emit("deleteitem", value);
    },
    // 新增问题
    async onload() {
      if (this.question.add) {
        switch (this.question.type) {
          case 1:
            this.data.questionTitle = "新建一个单选题";
            this.data.questionDescription = "这是一个单选题";
            this.data.answer.possibleAnswers = ["新建选项1", "新建选项2"];
            break;
          case 2:
            this.data.questionTitle = "新建一个多选题";
            this.data.questionDescription = "这是一个多选题";
            this.data.answer.possibleAnswers = ["新建选项1", "新建选项2"];
            break;
          case 3:
            this.data.questionTitle = "新建一个填空题";
            this.data.questionDescription = "这是一个填空题";
            break;
          case 4:
            this.data.questionTitle = "新建一个问答题";
            this.data.questionDescription = "这是一个问答题";
            break;
          case 5:
            this.data.questionTitle = "新建一个选框题";
            this.data.questionDescription = "这是一个选框题";
            this.data.answer.possibleAnswers = ["新建选项1", "新建选项2"];
            break;
          case 7:
            this.data.questionTitle = "新建一个评分题";
            this.data.questionDescription = "这是一个评分题";
            break;
          case 8:
            this.data.questionTitle = "新建一个上传题";
            this.data.questionDescription = "这是一个上传题";
            break;
          default:
        }
        switch (this.question.msg) {
          case "name":
            this.data.questionTitle = "您的姓名";
            this.data.questionDescription = "请输入你的姓名";
            break;
          case "sex":
            this.data.questionTitle = "您的性别";
            this.data.questionDescription = "请选择你的性别";
            this.data.answer.possibleAnswers = ["男", "女"];
            break;
          case "age":
            this.data.questionTitle = "您的年龄段";
            this.data.questionDescription = "请选择你的年龄段";
            this.data.answer.possibleAnswers = [
              "18岁以下",
              "18-30",
              "30-45",
              "45岁以上",
            ];
            break;
          default:
        }
        const list={...this.data}
        delete list.id
        const addquestiondata = await addquestion(list);
        this.data.id = addquestiondata.data.data;
        this.data.answer.id = addquestiondata.data.data;
        const answer = { ...this.data.answer };
        answer.correctAnswers = JSON.stringify(answer.correctAnswers);
        answer.possibleAnswers = JSON.stringify(answer.possibleAnswers);
        await addAnswer(answer);
        this.$emit("change", this.data);
      }
      Object.assign(this.data,this.question);
      if (this.data.answer.correctAnswers==null) {
        this.data.answer.correctAnswers=[""]
      }
    },
  },
};
</script>
<style lang='scss' scoped>
</style>