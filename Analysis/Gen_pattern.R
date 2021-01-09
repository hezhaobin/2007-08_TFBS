library(RMySQL)
myCon <- dbConnect("MySQL", host = "turissinig5.uchicago.edu", user =
"hebin", password = "fruitfly", dbname = "hebin")

species <- 'dme'
energy_sql <- paste("select ID, energy fold_energy from feature where
species = '", species, "'", sep="")
sample_df <- dbGetQuery(myCon, energy_sql)


hist(sample_df$fold_energy)

###############
# Quality of 
# poly data
# Dec 19th 07
###############

library(RMySQL)
myCon <- dbConnect("MySQL", host = "turissinig5.uchicago.edu", user =
"hebin", password = "fruitfly", dbname = "hebin")

allelefreq <- dbGetQuery(myCon, "select tf_name, allele_number, count(*) count from tfbs_poly_bak group by tf_name, allele_number")

attach(allelefreq)
allelefreq$tf_name[1:6] <- "flanking"
as.factor(allelefreq$tf_name)

par(mfcol = c(1,3))->par
pie(count[tf_name == 'bs'], labels = allele_number[tf_name=='bs'], cloc=T, main='binding sites', init=0)
pie(count[tf_name == 'flanking'], labels = allele_number[tf_name=='flanking'], cloc=T, main='flanking', init=0)
pie(count[tf_name == 'spacer'], labels = allele_number[tf_name=='spacer'], cloc=T, main='spacer', init=0)
par(par)

total[1]<-sum(count[tf_name == 'bs'])

################################
# correlation(binding affinity
# , conservation)
# Dec 19th 07
################################

data <- read.table("Score_divergence.txt", head=T)
sum(data$score > 0)
#[1] 715
sum(data$score <= 0)
#[1] 79
sum(data$div[data$score > 0]>0)
#[1] 130, 130/715 ≈ 18.2%
sum(data$div[data$score <= 0]>0)
#[1] 15 15/79 ≈ 19.0%

######################
# Polarized mutations
# Jan 9th 08
######################

setwd("/Volumes/hebin-1/Documents/tfbs/Result")
data <- read.table("polarized_mutations_per_tfbs", head=T)
hist(data$change[data$species == 'sim'], xlab = 'change', main = 'changes on sim branch')
hist(data$change[data$species == 'mel'], xlab = 'change', main = 'changes on mel branch')
par(mfcol=c(1,2))->par
plot(data$change[data$species == 'sim']~data$scorem[data$species == 'sim'], xlab = 'ancestral binding score', ylab = 'change on sim branch', ylim = c(-12, 8))
plot(data$change[data$species == 'mel']~data$scorem[data$species == 'mel'], xlab = 'ancestral binding score', ylab = 'change on mel branch', ylim = c(-12, 8))
summary(data$species[data$change > -1 & data$change <1])  
summary(data$species[data$change >= 1]) 
summary(data$species[data$change <= -1])
summary(data$species[data$change > -.5 & data$change <.5])  
summary(data$species[data$change >= .5]) 
summary(data$species[data$change <= -.5])

