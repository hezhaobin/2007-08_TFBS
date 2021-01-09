list<-c("CG11648", "CG10325", "CG10067", "CG1851", "CG1913", "CG8827", "CG3166", "CG4531", "CG7508", "CG10146", "CG10422", "CG7902", "CG1034", "CG9277", "CG3401", "CG9359", "CG13425", "CG10021", "CG3096", "CG32134", "CG5264", "CG1759", "CG1365", "CG32150", "CG5064", "CG11798", "CG17894", "CG7503", "CG6519", "CG7450", "CG5893", "CG4952", "CG1772", "CG10697", "CG1385", "CG2189", "CG9741", "CG3629", "CG2788", "CG8704", "CG9885", "CG12763", "CG17348", "CG10810", "CG8365", "CG2345", "CG15085", "CG7266", "CG2988", "CG9015", "CG9554", "CG17285", "CG10002", "CG2047", "CG12245", "CG6494", "CG18144", "CG9786", "CG4637", "CG8361", "CG14548", "CG8333", "CG7223", "CG6736", "CG11551", "CG7933", "CG7931", "CG12296", "CG10197", "CG4717", "CG4761", "CG1264", "CG6570", "CG7279", "CG5248", "CG6099", "CG8337", "CG1429", "CG12249", "CG8175", "CG8091", "CG12908", "CG4550", "CG11797", "CG30129", "CG30128", "CG11218", "CG8462", "CG13873", "CG13874", "CG30141", "CG30142", "CG13421", "CG30150", "CG30145", "CG15582", "CG31557", "CG18111", "CG7592", "CG3851", "CG18455", "CG10036", "CG31481", "CG12287", "CG17888", "CG15151", "CG9681", "CG10108", "CG10118", "CG8246", "CG6716", "CG5939", "CG17228", "CG31240", "CG16740", "CG1004", "CG4319", "CG6464", "CG1030", "CG1130", "CG10130", "CG6127", "CG11720", "CG18087", "CG7771", "CG3871", "CG32434", "CG8355", "CG6534", "CG16738", "CG2939", "CG3956", "CG11121", "CG5557", "CG3992", "CG7938", "CG1395", "CG31317", "CG12443", "CG7895", "CG5490", "CG6868", "CG1378", "CG4898", "CG3048", "CG2956", "CG10388", "CG1650", "CG3830", "CG9048", "CG16874", "CG10491", "CG1454", "CG4889", "CG1046", "CG3948")
setwd("~/Documents/#LAB/tfbs/Result")
data <- read.table("pol_syn_diff.txt", head=T)
subset <- NULL
CG <- as.character(data$CG)
for(i in 1:length(list)){
  subset <- c(subset,grep(paste(list[i],"-",sep=""),CG))
}

data2 <- data[subset,]
cond <- (!is.na(data2$fixS))
sum(data2$fixS[cond])  #unpolarized div
sum(data2$polyS[cond]) #unpolarized poly
sum(data2$fixN[cond])  #unpolarized div
sum(data2$polyN[cond]) #unpolarized poly
cond2 <- (!is.na(data2$fixS.1))
sum(data2$fixS.1[cond2])
sum(data2$polyS.1[cond2])
